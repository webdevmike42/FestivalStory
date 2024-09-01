type StateMethods<S> = {
    enter?: () => void;
    exit?: () => void;
    update?: () => void;
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

    transition(toState: S) {

        // if new state does not exist, ignore transition
        if(!this.states[toState])
            return;
        
        if (!this.isFirstTransition && this.states[this.currentState]?.exit) {
            this.states[this.currentState]?.exit!();
        }

        if(this.isFirstTransition)
            this.isFirstTransition = false;

        this.currentState = toState;

        if (this.states[this.currentState]?.enter) {
            this.states[this.currentState]?.enter!();
        }

        
    }

    update() {
        if (this.states[this.currentState]?.update) {
            this.states[this.currentState]?.update!();
        }
    }

    getState() {
        return this.currentState;
    }
}

// Beispielnutzung für zwei verschiedene Spielobjekte

// Spieler mit Zuständen
type PlayerState = 'Idle' | 'Running' | 'Jumping';

//const playerStateMachine = new StateMachine<PlayerState>('Idle');
/*
// Gegner mit anderen Zuständen
type EnemyState = 'Patrolling' | 'Attacking' | 'Dead';
const enemyStateMachine = new StateMachine<EnemyState>('Patrolling');

playerStateMachine.addState('Idle', {
    enter: () => console.log('Player enters Idle state'),
    exit: () => console.log('Player exits Idle state'),
    update: () => console.log('Player is Idle'),
});

enemyStateMachine.addState('Attacking', {
    enter: () => console.log('Enemy starts attacking'),
    exit: () => console.log('Enemy stops attacking'),
    update: () => console.log('Enemy is attacking'),
});
*/

// Zustandsübergänge

//playerStateMachine.transition('Running');
//enemyStateMachine.transition('Attacking');

