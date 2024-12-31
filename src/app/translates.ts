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
    this.translates.push(new translate("StudentMang", "إدارة الطلاب", "Student Management"))
    this.translates.push(new translate("Facilities", "المرافق", "Facilities"))
    this.translates.push(new translate("BuildingMang", "إدارة المباني", "Building Management"))
    this.translates.push(new translate("ReserRoom", "حجز غرفة", "Reservation Room"))
    this.translates.push(new translate("ChooseBuilding", "اختر المبنى", "Choose Building"))
    this.translates.push(new translate("ChooseFloor", "اختر الطابق", "Choose Floor"))
    this.translates.push(new translate("Rooms", "جميع الغرف", "Rooms"))
    this.translates.push(new translate("Name", "الأسم", "Name"))
    this.translates.push(new translate("StartDate", "تاريخ البداية", "Start Date"))
    this.translates.push(new translate("ExpireDate", "تاريخ النهاية", "Expire Date"))
    this.translates.push(new translate("Confirm", "تاكيد", "Cancel"))
    this.translates.push(new translate("Cancel", "إلغاء", "Cancel"))
    this.translates.push(new translate("Update", "تعديل", "Update"))
    this.translates.push(new translate("Delete", "حذف", "Delete"))
    this.translates.push(new translate("Edit", "تعديل", "Edit"))
    this.translates.push(new translate("NoFacilities", "لا يوجد مرافق مضافة ", "No Added Facilities"))
    this.translates.push(new translate("capacity", "سعة الغرفة", "Capacity"))
    this.translates.push(new translate("RoomType", "نوع الغرفة", "Room Type "))
    this.translates.push(new translate("RoomNum", "", ""))
    this.translates.push(new translate("RoomNum", "", ""))
    this.translates.push(new translate("RoomNum", "", ""))
    this.translates.push(new translate("RoomNum", "", ""))
    this.translates.push(new translate("RoomNum", "", ""))
    this.translates.push(new translate("RoomNum", "", ""))
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
