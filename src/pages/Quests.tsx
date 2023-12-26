import {
  Breadcrumb,
  Button,
  Card,
  Container,
  Form,
  Progress,
  Table,
} from 'react-bulma-components';
import { Link, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { gql, useQuery } from '@apollo/client';
import useWindowDimensions from '../hooks/useWindowDimensions';
import { Query, QuestFilterInput } from '../types';
import { ErrorMessage } from '../components/global/ErrorMessage';
import { SearchBox } from '../components/SearchBox';

const QUESTS = gql`
  query GetQuests(
    $first: Int
    $last: Int
    $before: String
    $after: String
    $where: QuestFilterInput
  ) {
    quests(
      first: $first
      last: $last
      before: $before
      after: $after
      where: $where
    ) {
      nodes {
        id
        name
        type
        xp
        gold
        choiceCount
        rewardsChoice {
          count
          item {
            id
            name
            iconUrl
          }
        }
        rewardsGiven {
          count
          item {
            id
            name
            iconUrl
          }
        }
      }
      pageInfo {
        hasNextPage
        endCursor
        hasPreviousPage
        startCursor
      }
    }
  }
`;

const QuestType = {
  Group: 1,
  Travel: 2,
  Tome: 4,
  RvR: 8,
  PlayerKill: 16,
  Epic: 32,
} as const;

const questTypeIcon = (type: number): string => {
  if ((type & QuestType.PlayerKill) > 0) {
    return 'quest_rvr.png';
  }

  if ((type & QuestType.Group) > 0 && (type & QuestType.RvR) > 0) {
    return 'quest_rvr3.png';
  }

  if ((type & QuestType.RvR) > 0) {
    return 'quest_rvr2.png';
  }

  if ((type & QuestType.Travel) > 0) {
    return 'quest_travel.png';
  }

  if ((type & QuestType.Tome) > 0) {
    return 'quest_tome.png';
  }

  return 'quest_green.png';
};

const getQuestNameFilter = (search: URLSearchParams): QuestFilterInput => {
  const name = search.get('name');

  if (!name) {
    return {};
  }

  return { name: { contains: name } };
};

const getFilters = (search: URLSearchParams): QuestFilterInput => ({
  ...getQuestNameFilter(search),
});

export function Quests(): JSX.Element {
  const perPage = 15;
  const [search, setSearch] = useSearchParams();
  const { t } = useTranslation(['common', 'pages', 'enums']);
  const { loading, error, data, refetch } = useQuery<Query>(QUESTS, {
    variables: {
      where: getFilters(search),
      first: perPage,
    },
  });
  const { width } = useWindowDimensions();
  const isMobile = width <= 768;

  if (loading) return <Progress />;
  if (error) return <ErrorMessage name={error.name} message={error.message} />;
  if (data?.quests?.nodes == null)
    return <ErrorMessage customText={t('common:notFound')} />;

  const entries = data.quests.nodes;
  const { pageInfo } = data.quests;

  return (
    <Container max breakpoint="widescreen" mt={2}>
      <Breadcrumb>
        <Breadcrumb.Item>
          <Link to="/">{t('common:home')}</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item active>
          <Link to="/quests">{t('pages:quests.title')}</Link>
        </Breadcrumb.Item>
      </Breadcrumb>

      <Card mb={5}>
        <Card.Content>
          <Form.Field>
            <Form.Label>{t('pages:quests.search')}</Form.Label>
            <SearchBox
              initialQuery={search.get('name') || ''}
              onSubmit={(event) => {
                search.set('name', event);
                setSearch(search);
              }}
            />
          </Form.Field>
        </Card.Content>
      </Card>

      <div className="table-container">
        <Table striped hoverable size={isMobile ? 'narrow' : 'fullwidth'}>
          <thead>
            <tr>
              <th>{t('pages:quests.name')}</th>
              <th>{t('pages:quests.xp')}</th>
              <th>{t('pages:quests.gold')}</th>
              <th>{t('pages:quests.given')}</th>
              <th>{t('pages:quests.choice')}</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((quest) => (
              <tr key={quest.id}>
                <td>
                  <Link to={`/quest/${quest.id}`}>
                    <div className="icon-text">
                      <span className="icon has-text-info">
                        <img
                          src={`/images/icons/${questTypeIcon(quest.type)}`}
                          alt="Quest Type"
                        />
                      </span>
                      <span>{quest.name}</span>
                    </div>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
      {pageInfo && (
        <div className="field is-grouped is-pulled-right">
          {pageInfo.hasPreviousPage && (
            <Button
              color="info"
              size="small"
              onClick={() => {
                refetch({
                  first: undefined,
                  after: undefined,
                  last: perPage,
                  before: pageInfo.startCursor,
                });
              }}
            >
              {t('common:prevPage')}
              <i className="fas fa-circle-chevron-left ml-1" />
            </Button>
          )}
          {pageInfo.hasNextPage && (
            <Button
              color="info"
              size="small"
              onClick={() => {
                refetch({
                  first: perPage,
                  after: pageInfo.endCursor,
                  last: undefined,
                  before: undefined,
                });
              }}
            >
              {t('common:nextPage')}
              <i className="fas fa-circle-chevron-right ml-1" />
            </Button>
          )}
        </div>
      )}
    </Container>
  );
}
