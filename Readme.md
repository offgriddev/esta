# está overview

`está` is a GitHub Action responsible for analyzing the Cyclomatic Complexity of a TypeScript repo for export to a storage for future analysis. The philosophy behind `está` is that it is not harmful to a team to analyze estimates for projects for the sake of validating their validity. Valid estimates should be something we all strive to provide as engineers. Validating our estimates is part of our engineering practice. If we are not open to validating our estimates, we must be already aware that they are nonsense. Instead of running away from validation, we should be open to seeing what the _actual_ estimate was in relation to the one we've given for a certain task. Only when confronted with the reality of the actual estimate are we able to reflect on what happened.

An estimate is a theory. It's a theory about the future state of a project and what the work will be like when we approach it. In the software industry, we've opted to reduce our estimation practices to theater. We've feigned ideas out of thin air called "Story Points" and have concocted _games_ to drive an estimation process that is completely subjective. Subjective estimations like Story Points resent validation because a Story Point does not represent anything at all. It's a metaphor. We cannot operate in a rational manner by relying on figures of speech to drive estimates that inform businesses of the realities of software engineering.

This is why `está` exists. `está`, which originates from Spanish `estár`, which is a temporal state of existence. Frederick Brooks states that Complexity is "the business we are in" as software engineers, and complexity is a time-bound phenomenon. This action will take a snapshot of the cyclomatic complexity of a TypeScript repository so your team can use it as an _objective_ metric for driving estimates. Software _is_ a given complexity for a moment in time. Complexity grows in a system, and as teams commit, this can be reduced or increased. This is an important fact to be aware of as engineers. If a module in your system gets too complex, it has been linked through numerous studies that it will become the thorn in the side of the developers maintaining it.

## cyclomatic complexity as a basis for estimations

Cyclomatic Complexity, as defined in Thomas McCabe's 1976 paper "A Complexity Measure", is the application of a graph theory's Circuit Rank to the control flow graph within a given codebase. This is a concrete, objective measurement from the code that developers labor over. Developers produce code, and as code is produced overtime, simply analyzing the complexity of the codebase and the size of each module can not only inform the team of where to drive future optimizations, but how to understand their _true velocity_.

Story Points are fake. They're a made up measurement of development work that has no grounds in our experience. We _slice_ our projects into "stories" and rank them by size, but there is no "story" that I can perceive _in the world_ whereby I can "measure" it's magnitude, thickness, color, size, shape, or any other secondary characteristic of its existence. Therefore, we could _never_ understand our _true velocity_ by it as we build software. You may as well be counting how many angels are dancing on the head of a pin.

Complexity, as measured in software by McCabe, provides us with a _concrete_ and _real_ measurement. Teams can use the GitHub commit data with the complexity measurement of the repository, to observe the organic growth of their systems and modules. With this, they can see how quickly they _deliver complexity_ and measure their _speed_ over time. This is a measure of efficiency in teams.

Therefore, when you are asked by your stakeholders how long something will take to build, you can provide a _reasonable estimate_ based on data, not just the subjective feelings about the invisible size of a "story," which has no relation to a stakeholders _budget_ or _capital investent_. Complexity, however, can easily be converted into time without the classic "cheatsheet" for story point estimates because are observing the _rate of production_. Software is complexity. Observing complexity emerge in code is observing the _rate of production_ in software engineering organizations.

## ground rules for complexity

McCabe's states that Cyclomatic Complexity is a mathematical measure for modularization of software. As we reduce the amount of logical, linear paths that can be traced through code, maintainability and realibility of the code increases. This also follows from _simplification_. Therefore, when we approach estimations, we must limit the complexity of the modules in our design.

`<to be completed>`

# overview
