import { gql } from '@apollo/client';
import { useTranslation } from 'react-i18next';
import { KillsList } from './KillsList';

const RECENT_DEATHS = gql`
  query GetLatestCharacterDeaths(
    $id: ID!
    $first: Int
    $last: Int
    $before: String
    $after: String
    $from: Long
    $to: Long
    $soloOnly: Boolean
  ) {
    kills(
      victimId: $id
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

export const CharacterRecentDeaths = ({ id }: { id: number }): JSX.Element => {
  const { t } = useTranslation('components');

  return (
    <KillsList
      title={t('characterRecentDeaths.title')}
      query={RECENT_DEATHS}
      queryOptions={{
        variables: { id },
      }}
      perPage={10}
      showTime={false}
      showVictim={false}
    />
  );
};
