export class ApiLinks {
  // public static MainUrl: string = "https://qu.ratco-solutions.com/api/"
  // public static AdminUrl: string = ApiLinks.MainUrl + "admins/"
  // public static StudentUrl: string = ApiLinks.MainUrl + "users/"
  public static MainUrl: string = "http://127.0.0.1:8000/api/";
  public static getBuildingData: string = ApiLinks.MainUrl + "admins/getBuildingData";
  public static adminLogin: string = ApiLinks.MainUrl + "admins/login";
  public static addBuilding: string = ApiLinks.MainUrl + "admins/addBuilding"
  public static deleteBuilding: string = ApiLinks.MainUrl + "admins/deleteBuilding"
  public static updateBuilding: string = ApiLinks.MainUrl + "admins/updateBuilding"
  public static addFloor: string = ApiLinks.MainUrl + "admins/addFloor"
  public static updateFloor: string = ApiLinks.MainUrl + "admins/updateFloor"
  public static deleteFloor: string = ApiLinks.MainUrl + "admins/deleteFloor"
  public static addRoom: string = ApiLinks.MainUrl + "admins/addRoom"
  public static updateRoom: string = ApiLinks.MainUrl + "admins/updateRoom"
  public static deleteRoom: string = ApiLinks.MainUrl + "admins/deleteRoom"
  public static addSuite: string = ApiLinks.MainUrl + "admins/addSuite"
  public static updateSuite: string = ApiLinks.MainUrl + "admins/updateSuite"
  public static deleteSuite: string = ApiLinks.MainUrl + "admins/deleteSuite"
  public static addMultiRoom: string = ApiLinks.MainUrl + "admins/addMultiRoom"
}
