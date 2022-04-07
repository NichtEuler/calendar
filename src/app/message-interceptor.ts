import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Observable, throwError } from "rxjs";
import { catchError, tap } from "rxjs/operators";

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    constructor(private snackBar: MatSnackBar) { }
    intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
        return next.handle(request).pipe(
            tap(e => {
                if (request.method == "POST" || request.method == "PUT")
                    if (e instanceof HttpResponse && e.status == 200) {
                        this.snackBar.open(e.body.message, 'Close', { duration: 2000, panelClass: ['mat-toolbar', 'mat-primary'] });
                    }
            }),
            catchError(error => {
                this.snackBar.open(error.message, "Close", { duration: 2000, panelClass: ['mat-toolbar', 'mat-warn', "mat-primary"] });
                return throwError(error);
            })
        );
    }
}