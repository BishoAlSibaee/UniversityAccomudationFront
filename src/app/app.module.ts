import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MainPageComponent } from './main-page/main-page.component';
import { MatTabsModule } from '@angular/material/tabs';
import { HeaderComponent } from './header/header.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { AddStudentComponent } from './add-student/add-student.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatToolbarModule } from '@angular/material/toolbar';
import { HttpClientModule } from '@angular/common/http';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatDialogModule } from '@angular/material/dialog';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MakeReservationComponent } from './make-reservation/make-reservation.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { DialogMessageComponent } from './dialog-message/dialog-message.component';
import { LoadingDialogComponent } from './loading-dialog/loading-dialog.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TestComponent } from './test/test.component';
import { RoomComponent } from './room/room.component';
import { SuiteComponent } from './suite/suite.component';
import { AddBuildingComponent } from './add-building/add-building.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { DialogEditAndAddBuilding } from './dialog-edit-and-add-building/dialog-edit-and-add-building.component';
import { BuildingsManagementComponent } from './buildings-management/buildings-management.component';
import { AddFloorComponent } from './add-floor/add-floor.component';
import { DialogEditAndAddFloorComponent } from './dialog-edit-and-add-floor/dialog-edit-and-add-floor.component';
import { AddRoomComponent } from './add-room/add-room.component';
import { DialogEditAndAddRoomComponent } from './dialog-edit-and-add-room/dialog-edit-and-add-room.component';
import { DialogDeleteComponent } from './dialog-delete/dialog-delete.component';
import { AddSuiteComponent } from './add-suite/add-suite.component';
import { DialogEditAndAddSuiteComponent } from './dialog-edit-and-add-suite/dialog-edit-and-add-suite.component';
import { DialogAddMultiRoomComponent } from './dialog-add-multi-room/dialog-add-multi-room.component';
import { UserManagementComponent } from './user-management/user-management.component';
import { StudentManagementComponent } from './student-management/student-management.component';
import { DialogAddUserComponent } from './dialog-add-user/dialog-add-user.component';
import { DialogEditAndAddStudentComponent } from './dialog-edit-and-add-student/dialog-edit-and-add-student.component';
import { SearchStudentComponent } from './search-student/search-student.component';
import { CustomStudentSearchComponent } from './custom-student-search/custom-student-search.component';
import { MatRadioModule } from '@angular/material/radio';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { ReactiveFormsModule } from '@angular/forms';
import { DialogReservationComponent } from './dialog-reservation/dialog-reservation.component';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    MainPageComponent,
    HeaderComponent,
    AddStudentComponent,
    MakeReservationComponent,
    DialogMessageComponent,
    LoadingDialogComponent,
    TestComponent,
    RoomComponent,
    SuiteComponent,
    AddBuildingComponent,
    DialogEditAndAddBuilding,
    BuildingsManagementComponent,
    AddFloorComponent,
    DialogEditAndAddFloorComponent,
    AddRoomComponent,
    DialogEditAndAddRoomComponent,
    DialogDeleteComponent,
    AddSuiteComponent,
    DialogEditAndAddSuiteComponent,
    DialogAddMultiRoomComponent,
    UserManagementComponent,
    StudentManagementComponent,
    DialogAddUserComponent,
    DialogEditAndAddStudentComponent,
    SearchStudentComponent,
    CustomStudentSearchComponent,
    DialogReservationComponent,

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
    MatRadioModule,
    MatSnackBarModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    NgxMaterialTimepickerModule,
    RouterModule.forRoot([{ path: '', redirectTo: '/login', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    { path: 'mainPage', component: MainPageComponent },
    { path: 'addStudent', component: AddStudentComponent },
    { path: 'makeReservation', component: MakeReservationComponent },
    { path: 'test', component: TestComponent },
    { path: 'addBuilding', component: AddBuildingComponent },
    { path: 'BuildingsManagement', component: BuildingsManagementComponent },
    { path: 'StudentManagement', component: StudentManagementComponent },
    { path: 'UsersManagement', component: UserManagementComponent },
    ]),
  ],
  providers: [DialogMessageComponent],
  bootstrap: [AppComponent]
})
export class AppModule {

}
