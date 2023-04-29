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
