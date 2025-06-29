import { AppComponent } from "./app.component";
import { translate } from "./translate";

export class translates {
  static translates: translate[] = []

  constructor() { }

  public static create() {
    this.translates.push(new translate("RoomInfo", "معلومات الغرفة", "Room information"))
    this.translates.push(new translate("RoomNum", "رقم الغرفة", "Room Number"))
    this.translates.push(new translate("BuildingName", "أسم المبنى", "Building Name"))
    this.translates.push(new translate("FloorNum", "رقم الطابق", "Floor Number"))
    this.translates.push(new translate("RoomReser", "حجوزات الغرفة", "Room Reservations"))
    this.translates.push(new translate("NoReser", "لا توجد حجوزات لهذه الغرفة", "No Reservations For This Room."))
    this.translates.push(new translate("LogOut", "تسجيل خروج ", "LogOut"))
    this.translates.push(new translate("UserMang", "إدارة المستخدمين", "User Management"))
    this.translates.push(new translate("StudentMang", "إدارة النزلاء", "Guest Management"))
    this.translates.push(new translate("Facilities", "المرافق", "Facilities"))
    this.translates.push(new translate("BuildingMang", "إدارة المباني", "Building Management"))
    this.translates.push(new translate("ReserRoom", "حجز غرفة", "Reservation Room"))
    this.translates.push(new translate("ChooseBuilding", "اختر المبنى", "Choose Building"))
    this.translates.push(new translate("ChooseSuite", "اختر الجناح", "Choose Suite"))
    this.translates.push(new translate("ChooseFloor", "اختر الطابق", "Choose Floor"))
    this.translates.push(new translate("ChooseRoom", "اختر الغرفة", "Choose Room"))
    this.translates.push(new translate("Rooms", "جميع الغرف", "Rooms"))
    this.translates.push(new translate("Name", "الأسم", "Name"))
    this.translates.push(new translate("StartDate", "تاريخ البداية", "Start Date"))
    this.translates.push(new translate("ExpireDate", "تاريخ النهاية", "Expire Date"))
    this.translates.push(new translate("Confirm", "تأكيد", "Confirm"))
    this.translates.push(new translate("Cancel", "إلغاء", "Cancel"))
    this.translates.push(new translate("Update", "تعديل", "Update"))
    this.translates.push(new translate("Delete", "حذف", "Delete"))
    this.translates.push(new translate("Edit", "تعديل", "Edit"))
    this.translates.push(new translate("NoFacilities", "لا يوجد مرافق مضافة ", "No Added Facilities"))
    this.translates.push(new translate("capacity", "سعة الغرفة", "Capacity"))
    this.translates.push(new translate("RoomType", "نوع الغرفة", "Room Type "))
    this.translates.push(new translate("WelcomeLogin", "يـرجـى تـسـجـيـل الـدخـول لـلـمـتـابـعـة", "Please log in to continue"))
    this.translates.push(new translate("Welcome", "مـــرحـــبًـــا بـــك", "Welcome"))
    this.translates.push(new translate("Required", "جميع الحقول مطلوبة", "All Fields Are Required."))
    this.translates.push(new translate("UserName", "اسم المستخدم", "User Name"))
    this.translates.push(new translate("Password", "كلمة المرور", "Password"))
    this.translates.push(new translate("EnterUserName", "ادخل اسم المستخدم", "Enter your username"))
    this.translates.push(new translate("EnterPassword", "ادخل كلمة المرور", "Enter your password"))
    this.translates.push(new translate("Add", "اضافه", "Add"))
    this.translates.push(new translate("Back", "رجوع", "Back"))
    this.translates.push(new translate("AllUser", "جميع المستخدمين", "Users"))
    this.translates.push(new translate("Mobile", "رقم الجوال", "Mobile"))
    this.translates.push(new translate("Email", "البريد الألكتروني", "Email"))
    this.translates.push(new translate("UserPermission", "صلاحية المستخدم", "User Permission"))
    this.translates.push(new translate("Actions", "الإجراءات", "Actions"))
    this.translates.push(new translate("ConfirmDeletion", "تأكيد الحذف", "Confirm Deletion"))
    this.translates.push(new translate("SureDelete", "هل انت متأكد من عملية الحذف", "Are you sure you want to delete this item?"))
    this.translates.push(new translate("PasswordConfirmation", "تأكيد كلمة المرور", "Password Confirmation"))
    this.translates.push(new translate("Enter", "ادخل", "Enter"))
    this.translates.push(new translate("User", "مستخدم", "User"))
    this.translates.push(new translate("Admin", "مدير", "Admin"))
    this.translates.push(new translate("DeleteDone", "تم الحذف بنجاح", "Delete Successfully"))
    this.translates.push(new translate("DeleteNo", "لم يتم الحذف حاول مرة أخرى", "Not Deleted Try Again"))
    this.translates.push(new translate("AddDone", "تمت الأضافة بنجاح", "Added Successfully"))
    this.translates.push(new translate("UpdateDone", "تم التعديل بنجاح", "Modified Successfully"))
    this.translates.push(new translate("SelectSearch", "حدد نوع البحث", "Select Search Type"))
    this.translates.push(new translate("Searchfor", "البحث عن الطالب حسب الكلية", "Search for student by college"))
    this.translates.push(new translate("By1", "حسب اسم النزيل", "By Guest Name"))
    this.translates.push(new translate("By2", "حسب رقم النزيل", "By Guest Number"))
    this.translates.push(new translate("By3", "حسب رقم جوال النزيل", "By Guest Mobile Number"))
    this.translates.push(new translate("SearchWord", "كلمة البحث", "Search Word"))
    this.translates.push(new translate("StudentCollege", "كلية الطالب", "Student College"))
    this.translates.push(new translate("Select", "اختر", "Select"))
    this.translates.push(new translate("StudentNumber", "رقم النزيل", "Guest Number"))
    this.translates.push(new translate("AddStudent", "اضافه نزيل", "Add Guest"))
    this.translates.push(new translate("PersonalNum", "الرقم الشخصي", "Personal Number"))
    this.translates.push(new translate("UpdateStudent", "تعديل النزيل", "Update Guest"))
    this.translates.push(new translate("SearchStudent", "البحث عن نزيل", "Search Guest"))
    this.translates.push(new translate("NewStudent", "تسجيل نزيل جديد", "Register New Guest"))
    this.translates.push(new translate("Nationality", "الجنسية", "Nationality"))
    this.translates.push(new translate("SelectNationality", "اختر الجنسية", "Select Nationality"))
    this.translates.push(new translate("NameAR", "الأسم بالعربي", "Name AR"))
    this.translates.push(new translate("NameEN", "الأسم بلأنجليزي", "Name EN"))
    this.translates.push(new translate("AddFacilitie", "اضافة مرفق", "Add Facilitie"))
    this.translates.push(new translate("Buildings", "المباني", "Buildings"))
    this.translates.push(new translate("Floors", "الطوابق", "Floors"))
    this.translates.push(new translate("Rooms", "الغرف", "Rooms"))
    this.translates.push(new translate("Suites", "الأجنحه", "Suites"))
    this.translates.push(new translate("BuildingNumber", "رقم المبنى", "Building Number"))
    this.translates.push(new translate("TotalFloors", "عدد الطوابق", "Total Floors"))
    this.translates.push(new translate("TotalSuites", "عدد الأجنحة", "Total Suites"))
    this.translates.push(new translate("TotalRooms", "عدد الغرف", "Total Rooms"))
    this.translates.push(new translate("UpdateBuilding", "تعديل المبنى", "Update Building"))
    this.translates.push(new translate("AddNewBuilding", "اضافة مبنى جديد", "Add New Building"))
    this.translates.push(new translate("AddNewFloor", "اضافة طابق جديد", "Add New Floor"))
    this.translates.push(new translate("UpdateFloor", "تحديث الطابق", "Update Floor"))
    this.translates.push(new translate("AddRooms", "اضافه غرف", "Add Rooms"))
    this.translates.push(new translate("AddMultiRoom", "إضافة غرف متعددة", "Add Multi Room"))
    this.translates.push(new translate("NumberOfRoom", "عدد الغرف", "Number Of Room"))
    this.translates.push(new translate("numberRoom", "", ""))
    this.translates.push(new translate("Firstroom", "رقم اول غرفة", "First room number"))
    this.translates.push(new translate("ReservationManagement", "إدارة الحجز", "Reservation Management"))
    this.translates.push(new translate("MakeReservation", "حجز غرفة ", "Make Reservation"))
    this.translates.push(new translate("GetByDate", "بحث عن الحجز بحسب التاريخ", "Get Reservation By Date"))
    this.translates.push(new translate("GetByStudent", "بحث عن الحجز بحسب النزيل ", "Get Reservation By Guest"))
    this.translates.push(new translate("EmptyRoom", "غرفة فارغه", "Empty Room"))
    this.translates.push(new translate("AvailableRoom", "غرفة متاحه", "Available Room"))
    this.translates.push(new translate("AllEmptyRoom", "جميع الغرف الفارغه", "All Empty Rooms"))
    this.translates.push(new translate("AllAvailableRoom", "جميع الغرف المتاحه", "All Available Rooms"))
    this.translates.push(new translate("MoreOptions", "خيارات إضافيه", "More Options"))
    this.translates.push(new translate("AvailableRoom1", "الغرف المتاحة", "Available Room"))
    this.translates.push(new translate("CurrentTenants", "المستأجرين الحاليين", "Current Tenants"))
    this.translates.push(new translate("StartReser", "تاريخ بداية الحجز", "Reservation Start Date"))
    this.translates.push(new translate("EndReser", "تاريخ نهاية الحجز", "Reservation End Date"))
    this.translates.push(new translate("NoReservation", "لا يوجد مستأجرين ضمن المدة المدخلة في هذه الغرفة.", "There are no renters for the entered period in this room."))
    this.translates.push(new translate("AddedGuset", "المستأجرين المضافين", "Added Guset"))
    this.translates.push(new translate("AddedFacilities", "المرافق المضافة", "Added Facilities"))
    this.translates.push(new translate("MakeReservation1", "تنفيذ الحجز", "Make Reservation"))
    this.translates.push(new translate("NoChange", "لا يمكن تغيير الغرفة بعد اضافة الحجز", "The room cannot be changed after the reservation is added"))
    this.translates.push(new translate("EnterDate", "ادخل التاريخ", "Enter Date"))
    this.translates.push(new translate("SelectSearch", "اختر نوع البحث", "Select the type search"))
    this.translates.push(new translate("ReservationDone", "تم الحجز بنجاح", "The Reservation Was Successful."))
    this.translates.push(new translate("Search", "بحث", " Search"))
    this.translates.push(new translate("SelectGuest", "اختر النزيل", "Select Guest"))
    this.translates.push(new translate("AvailableFacilities", "المرافق المتاحة ", "Available Facilities"))
    this.translates.push(new translate("SelectAll", "اختيار الكل", "Select All"))
    this.translates.push(new translate("ResAlready", "الحجز موجود مسبقًا للنزيل", "The reservation already exists for the guest"))
    this.translates.push(new translate("CannotAdd", "لا يمكن الإضافة... عدد الأشخاص يتجاوز سعة الغرفة.", "Cannot add ... The number of occupants exceeds the room capacity"))
    this.translates.push(new translate("OnlyNumbers", "إدخال غير صالح: يسمح بالأرقام فقط", "Invalid input: Only numbers are allowed"))
    this.translates.push(new translate("OnlyName", "إدخال غير صالح: لا يمكن أن يحتوي الاسم على أرقام", "Invalid input: Name cannot contain numbers"))
    this.translates.push(new translate("ByPhone", "بحسب رقم الجوال", "By Phone Number"))
    this.translates.push(new translate("ByNumber", "بحسب الرقم الشخصي", "By Personal Number"))
    this.translates.push(new translate("UpdateReservation", "تحديث الحجز", "Update Reservation"))
    this.translates.push(new translate("ReservationNumber", "رقم الحجز", "Reservation Number"))
    this.translates.push(new translate("UpdateDate", "تعديل التاريخ", "Update date"))
    this.translates.push(new translate("UpdateRoom", "تعديل الغرفة ", "Update Room"))
    this.translates.push(new translate("CurrentRoom", "الغرفة الحالية", "Current Room"))
    this.translates.push(new translate("SearchRoom", "البحث عن الغرفة", "Search for the room"))
    this.translates.push(new translate("UpdateFacilities", "تعديل المرافق", "Update Facilities"))
    this.translates.push(new translate("NothingUpdate", "لم يتم تحديث أي شيء", "Nothing has been updated"))
    this.translates.push(new translate("MsgDate", "لا يمكن أن يكون تاريخ النهاية قبل تاريخ البداية", "End date cannot be before the start date"))
    this.translates.push(new translate("AddNewRoom", "اضافة غرفة جديدة", "Add New Room"))
    this.translates.push(new translate("SuitesNumber", "رقم الجناح", "Suites Number"))
    this.translates.push(new translate("AddNewSuite", "اضافة جناح جديد", "Add New Suite"))
    this.translates.push(new translate("UpdateSuite", "تعديل الجناح", "Update Suite"))
    this.translates.push(new translate("RoomInSuite", "الغرف في الجناح", "Room In Suite"))
    this.translates.push(new translate("OpeningReports", "تقارير فتح الأبواب", "Door Opening Reports"))
    this.translates.push(new translate("OpenTime", "وقت فتح الباب", "Door opening time"))
    this.translates.push(new translate("NoRecord", "لا يوجد سجلات لهذه الغرفة", "No Record For This Room"))
    this.translates.push(new translate("RoomNum", "", ""))
    this.translates.push(new translate("RoomNum", "", ""))
  }

  public static getTranslate(id: string) {
    for (let i = 0; i < this.translates.length; i++) {
      if (this.translates[i].id == id) {
        if (AppComponent.language == "ar") {
          return this.translates[i].ar
        }
        else {
          return this.translates[i].en
        }
      }
    }
    return ""
  }
}
