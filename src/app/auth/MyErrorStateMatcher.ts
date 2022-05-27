import { FormControl, FormGroup, FormGroupDirective, NgForm } from "@angular/forms";
import { ErrorStateMatcher } from "@angular/material/core";

export function checkPasswords(group: FormGroup) { // here we have the 'passwords' group
    let pass = group.controls.password.value;
    let confirmPass = group.controls.confirmPassword.value;
    return pass === confirmPass ? null : { notSame: true }
}
export class MyErrorStateMatcher implements ErrorStateMatcher {
    errorString: string;

    constructor(errorString) {
        this.errorString = errorString;
    }
    isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
        const invalidParent = !!(
            control
            && control.parent
            && control.parent.invalid
            && control.parent.dirty
            && control.parent.hasError(this.errorString));
        return (invalidParent);
    }
}