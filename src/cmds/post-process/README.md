# processing metric documents

Information required to automate estimates:

1. How long does it take for a developer to actually produce (merge to main) x complexity? (most important)

to calculate delivery time

1. get the date in jira from changelog when the card went into development
2. get the date in jira from changelog when the card went into closed
3. get the estimated complexity
4. get the actual added complexity (taken from a diff)

5. How long does it take a team, where cards are randomly assigned, to finish a project of x complexity?
6. Total cards in EPIC v. GIT commits with branch names that align.
7. Estimate time left in epic where card is not done.

## notes on projecting dev stats

process:

use-cases for determining end dates

1. If PR related to card is merged in.
2. If issue related to PR head ref is moved to Closed and accompanied by a main merge.
3. If issue related to PR head ref is moved to Closed and not accompanied by a main merge.

Only merges into main are considered actual data used to calculate delivery. Edge cases to moves of Jira
cards or cards on any board can be indeterminate. If there needs to be an override in the future, then
it should be easy to build in a trigger for these scenarios where certain tasks are closed but excluded
from calculations.

Therefore, start date is calculated by issue move and end date is calculated by merge to main. Otherwise, the card is excluded from delivery calculations.

1. get issue from head ref
2. pull jira issue and changelog
3. get projected estimate from custom field
4. get start date from changelog (start date is the official date the card was assigned and moved to in development)
5. get end date from main merge or noop
6. calculate length in days (number)
7. return result for complexity _n_ for _x_ days
8. count as one sample
