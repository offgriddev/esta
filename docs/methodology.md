# estimation by code complexity

For meaningful estimations, we need to rely on objective metrics. If we are to estimate in a meaninful way outside giving an estimation based on time to delivery, time being measured by hours / weeks / months. Therefore, subjective measurements cannot be the primary means of estimation for a development team as a concrete measurement is always required.

Estimations must be meaningful. With external factors, we might not know exactly when we will complete a given task. So there's an internal, subjective, and private calculus that occurs behind any given estimate for time that cannot be shared. Therefore, an objective means of estimating a given task will allow for a shared, meaningful estimate.

The objective metric that we give, that is not time-based, however must convert _to time_. Time ultimately matters most. The time it takes to deliver an effort is derived from the objective measurement the team gives about their effort _and_ the speed it takes developers to deliver a given card.

## complexity and estimation

Complexity here refers to the # of linear paths of a given module. Increased or decreased complexity in a given application is the fruit of development work. When giving an estimate, we are estimating the # of linear paths a given card will result in.

## how many linear paths will this card require?

When answering this question, there are two sides we need to consider.

(subjective) How would _I_ develop this task?
(objective) How many linear paths would my solution require?

If you receive a card with the following spec:

`name`: Add CLI and Integration for X API

`description`: Add a CLI and integration for X API.

`acceptance criteria`:

- add new cli command to pull back results from X API
- CLI should allow for all query parameters supported in X API integration

You find out that the team already has an X API client. So you just need to add a module for the new routes in X API. They also have a CLI already built out, so you just need to add a module for that.

So already, there are no real edge-cases. The solution has at least the following changes:

1. add command file for CLI
1. add integration to X API client

Structural Changes:

- /apps/cli/src/x/command.ts (complexity: 1)
- /packages/integrations/x/routes/endpoint.ts (complexity: 1)

Since there is one linear path through each file, and two files added, the effort will have a complexity of 2.

So now you can see that there is an element of code quality, style, and structural thinking required to make this estimate. It has an element of subjectivity because it's how _you_ would, and the objective measurement that you would give it.

During estimation, if you do not align, aim for the implementation breakdown that has the lowest overall complexity.

## evaluation

At checkin, running code metric analysis will answer what the actual result is. The system then begins to build a dataset around complexity and delivery time. Therefore, the estimates are validated and the delivery time becomes more apparent.
