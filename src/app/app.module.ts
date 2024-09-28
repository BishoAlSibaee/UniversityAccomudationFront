import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule ,FormControl } from '@angular/forms';
import { MainPageComponent } from './main-page/main-page.component';
import {MatTabsModule} from '@angular/material/tabs';
import { HeaderComponent } from './header/header.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatDividerModule} from '@angular/material/divider';
import { AddStudentComponent } from './add-student/add-student.component';
import {MatFormFieldModule,MatFormFieldControl} from '@angular/material/form-field';



import { MatInputModule } from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatToolbarModule} from '@angular/material/toolbar';
import { HttpClientModule } from '@angular/common/http';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatCardModule} from '@angular/material/card';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatDialogModule} from '@angular/material/dialog';
import { StudentsComponent } from './students/students.component';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatTableModule} from '@angular/material/table';
import { MakeReservationComponent } from './make-reservation/make-reservation.component';
import { MatDatepickerModule} from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { DialogMessageComponent } from './dialog-message/dialog-message.component';
import { LoadingDialogComponent } from './loading-dialog/loading-dialog.component';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    MainPageComponent,
    HeaderComponent,
    AddStudentComponent,
    StudentsComponent,
    MakeReservationComponent,
    DialogMessageComponent,
    LoadingDialogComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    MatTabsModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatToolbarModule,
    HttpClientModule,
    MatDialogModule,
    MatExpansionModule,
    MatCheckboxModule,
    MatCardModule,
    MatSidenavModule,
    MatPaginatorModule,
    MatTableModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatProgressSpinnerModule,
    RouterModule.forRoot([{ path: '', redirectTo: '/login', pathMatch: 'full' },{ path: 'login', component: LoginComponent },{path:'mainPage',component:MainPageComponent}
      ,{path:'addStudent',component:AddStudentComponent},{path:'students',component:StudentsComponent},{path:'makeReservation',component:MakeReservationComponent}
    ]),
  ],
  providers: [DialogMessageComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
