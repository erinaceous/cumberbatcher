import { Position, Type, fragments } from "./fragments.js";


export function findFragments({
    type = null,
    position = null,
    rude = null,
}) {
    return fragments.filter(fragment => {
        if (type !== null) {
            if (fragment.type !== Type.ANY && fragment.type !== type) {
                return false;
            }
        }
        if (position !== null) {
            if (fragment.position !== Position.ANY && fragment.position !== Position.ALONE && fragment.position !== position) {
                return false;
            }
        }
        if (rude !== null && rude !== fragment.rude) {
            return false;
        }
        return true;
    })
}


export function chooseFragment({
   type = null,
   position = null,
   rude = null,
}) {
    let choices = findFragments({type, position, rude});
    let index = Math.floor(Math.random() * choices.length);
    return choices[index];
}


export class Word {
    constructor(type = Type.ANY, rude = null) {
        this.type = type
        this.rude = rude
        this.text = this.generate();
    };

    generate() {
        let start = chooseFragment({type: this.type, position: Position.START, rude: this.rude});
        if (start.position === Position.ALONE) {
            return start.fragment
        }
        let end = chooseFragment({type: this.type, position: Position.END, rude: this.rude});
        if (end.position === Position.ALONE) {
            return end.fragment
        }
        let word = [start.fragment, end.fragment]
        if ((start.hyphenate || end.hyphenate) || start.fragment.endsWith(end.fragment[0])) {
            word = [start.fragment, "-", end.fragment]
        }
        return word.join("");
    }
}


export class Cumberbatcher {
    constructor(rude = null) {
        this.rude = rude;
    }

    generate() {
        let forename = new Word(Type.FORENAME, this.rude).text;
        let surname = new Word(Type.SURNAME, this.rude).text;
        this.name = [forename, surname].join(" ");
    }
}
