# esta

`está` is an action primarily for TypeScript repositories to analyze the cyclomatic complexity for a repository to provide information to understand how complexity is developed through software engineering in order to predict development projects more reliably and enable development teams to be more effective in communicating timelines to product teams.

# esta-action

A github action that takes a temporary state in software construction by performing static analysis on the codebase and generates a file with the information required to analyze the delivery of complexity in software systems.

# overview

This tool allows for insight into a team's delivery date for a given project using [Halstead Cyclomatic Complexity](https://en.wikipedia.org/wiki/Halstead_complexity_measures) or [Cyclomatic Complexity](https://en.wikipedia.org/wiki/Cyclomatic_complexity) projections for modules in a given development effort when the designs come in for feedback and critique.

With TypeScript, that can be accomplished with [ts-complex](https://www.npmjs.com/package/ts-complex), which uses [escomplex](https://github.com/escomplex/complexity-report) under the hood.

On the basis of Cyclomatic Complexity (CC), an objective and measureable byproduct of the development process, we can define an `estimate` as this:

> The total amount of time it takes a given development team to deliver the total amount of complexity for a given project.

CC is a software metric for empirical measurement of static code. It describes the number of linear independent paths within a given codebase. Developer contributions are measured through their affect on the overall complexity and how long this modification takes through time.

A given project's total complexity is documented in Jira.

- A custom field would be used on a Jira Issue (i.e. `complexity_estimate` and `complexity_actual`)
- The developers estimate what the complexity would be for `complexity_estimate`
- When developer a developer creates a branch, it should match the issue ID in Jira (i.e. `PREFIX-1242`)
- When developer merges branch into main, CI runs a script against the codebase and pushes up the total card for the `complexity_actual` field.

This can then be charted and understood along with developer velocity to make better estimates in the future. For more information, see [ADR0001](./docs/architecture/decisions/0001.md)
