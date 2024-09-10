type StateMethods<S> = {
    enter?: (stateParams?: any) => void;
    exit?: () => void;
    update?: () => { nextState: S, stateParams: any[] } | undefined;
};

export default class StateMachine<S extends string> {
    private currentState: S;
    private states: { [key in S]?: StateMethods<S> } = {};
    private isFirstTransition = true;

    constructor(initialState: S) {
        this.currentState = initialState;
    }

    addState(state: S, methods: StateMethods<S>) {
        this.states[state] = methods;
    }

    transition(toState: S, stateParams: any[]) {
        // if new state does not exist, ignore transition
        if (!this.states[toState])
            return;

        if (!this.isFirstTransition && this.states[this.currentState]?.exit) {
            this.states[this.currentState]?.exit!();
        }

        if (this.isFirstTransition)
            this.isFirstTransition = false;

        this.currentState = toState;

        if (this.states[this.currentState]?.enter) {
            this.states[this.currentState]?.enter!(stateParams);
        }
    }

    update() {
        if (this.states[this.currentState]?.update) {
            const transitionResult = this.states[this.currentState]?.update!();
            if (transitionResult)
                this.transition(transitionResult.nextState, transitionResult.stateParams);
        }
    }

    getState() {
        return this.currentState;
    }

    createTransitionResult(nextState: S, stateParams: any[]) {
        return {
            nextState,
            stateParams
        }
    }
}