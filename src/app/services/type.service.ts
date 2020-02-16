import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Type } from '../models/type';
import { environment } from '../environment';

@Injectable()
export class TypeService {
    baseurl = environment.baseUrl;
    
    dataChange: BehaviorSubject<Type[]> = new BehaviorSubject<Type[]>([]);
    dataChangeRegular: BehaviorSubject<Type[]> = new BehaviorSubject<Type[]>([]);
    // dataChangeWithRegular: BehaviorSubject<Type[]> = new BehaviorSubject<Type[]>([]);
    // dataChangeWithoutRegular: BehaviorSubject<Type[]> = new BehaviorSubject<Type[]>([]);

    //for update type
    successEmitter = new Subject<Type>();

    //for add type
    addTypeSuccessEmitter = new Subject<Type>();
    
    constructor(private httpClient: HttpClient) { }

    public getAllType(): Observable<Type[]> {
        this.httpClient.get<Type[]>(this.baseurl + '/type/all/').subscribe(data => {
            this.dataChange.next(data);
        },
            (error: HttpErrorResponse) => {

            });

        return this.dataChange.asObservable();
    }

 
    public addType(type: Type) {
        return this.httpClient.post(this.baseurl + '/type/', type);
    }

    public updateType(type: Type) {
        return this.httpClient.put(this.baseurl + '/type/', type);
    }

    public updateRegularTypes(types: Type[]) {
        return this.httpClient.put(this.baseurl + '/type' + '/regularTypes/', types);
    }

    public deleteType(id: number): void {
        this.httpClient.delete(this.baseurl + '/type/' + id).subscribe();
    }

    public getRegularTypes(){
        this.httpClient.get<Type[]>(this.baseurl + "/type/regular").subscribe(data => {
            this.dataChangeRegular.next(data);
        },
            (error: HttpErrorResponse) => {

            });
        return this.dataChangeRegular.asObservable();
    }
}