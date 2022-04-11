import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Observable, throwError } from "rxjs";
import { catchError, tap } from "rxjs/operators";

//https://gist.github.com/taylorhutchison/6700eae2338956f04a7b9d7ddaa6fd53
@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    constructor(private snackBar: MatSnackBar) { }
    intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
        return next.handle(request).pipe(
            tap(e => {
                if (request.method == "POST" || request.method == "PUT" || request.method == "DELETE")
                    if (e instanceof HttpResponse && (e.status == 200 || e.status == 201)) {
                        this.snackBar.open(e.body.message, 'Close', { duration: 3000, panelClass: ['success-snackbar'] });
                    }
            }),
            catchError(error => {
                this.snackBar.open(error.error.message, 'Close', { duration: 5000, panelClass: ['error-snackbar'] });
                return throwError(error);
            })
        );
    }
}