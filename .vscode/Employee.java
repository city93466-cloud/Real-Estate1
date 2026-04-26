public class Employee {

    String firstName;
    String lastName;
    String position;
    double salary;

    // Constructor 1
    Employee() {
        firstName = "";
        lastName = "";
        position = "";
        salary = 0;
    }

    // Constructor 2
    Employee(String f, String l) {
        firstName = f;
        lastName = l;
    }

    // Constructor 3
    Employee(String f, String l, String p) {
        firstName = f;
        lastName = l;
        position = p;
    }

    // Constructor 4
    Employee(String f, String l, String p, double s) {
        firstName = f;
        lastName = l;
        position = p;
        salary = s;
    }

    // عرض الاسم الكامل
    void displayFullName() {
        System.out.println("Full Name: " + firstName + " " + lastName);
    }

    // عرض التفاصيل
    void displayDetails() {
        System.out.println("Name: " + firstName + " " + lastName);
        System.out.println("Position: " + position);
        System.out.println("Salary: " + salary);
        System.out.println();
    }

    // MAIN
    public static void main(String[] args) {

        Employee e1 = new Employee();
        Employee e2 = new Employee("Ali", "Ahmed");
        Employee e3 = new Employee("Sara", "Ali", "Manager");
        Employee e4 = new Employee("Omar", "Hassan", "Engineer", 50000);

        e1.displayDetails();
        e2.displayDetails();
        e3.displayDetails();
        e4.displayDetails();
    }
}