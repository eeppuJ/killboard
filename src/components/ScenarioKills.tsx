import { gql } from '@apollo/client';
import { useTranslation } from 'react-i18next';
import { KillsList } from './KillsList';

const SCENARIO_KILLS = gql`
  query GetScenarioKills(
    $id: String
    $first: Int
    $last: Int
    $before: String
    $after: String
    $from: Long
    $to: Long
    $soloOnly: Boolean
  ) {
    kills(
      instanceId: $id
      first: $first
      last: $last
      before: $before
      after: $after
      from: $from
      to: $to
      soloOnly: $soloOnly
    ) {
      totalCount
      nodes {
        id
        time
        position {
          zoneId
        }
        scenarioId
        attackers {
          level
          renownRank
          damagePercent
          character {
            id
            career
            name
          }
          guild {
            id
            name
          }
        }
        victim {
          level
          renownRank
          character {
            id
            career
            name
          }
          guild {
            id
            name
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

export const ScenarioKills = ({ id }: { id: string }): JSX.Element => {
  const { t } = useTranslation('components');

  return (
    <KillsList
      title={t('scenarioKills.title')}
      query={SCENARIO_KILLS}
      queryOptions={{
        variables: { id },
      }}
      perPage={20}
    />
  );
};
