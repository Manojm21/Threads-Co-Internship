# Stock Management API Documentation

## Base URL
All endpoints are prefixed with `/stock`.

---

### Add a New Stock Item
**Endpoint:** `POST /`  
**Description:** Adds a new stock item to the database.

#### Request Body
```json
{
    "id": 1,
    "name": "Item Name",
    "colour": "Red",
    "total_quantity": 100,
    "balance_quantity": 50,
    "Rack_no": "A1"
}


/employees - GET
{
  "employee_id": 1,
  "name": "Alice Smith",
  "gender": "Female",
  "phone_number": "1234567890",
  "role": "Developer",
  "address": "123 Elm St",
  "aadhar_number": "123456789012",
  "date_of_joining": "2023-01-14T18:30:00.000Z",
  "salary": "60000.00"
}


# Employee Management API Documentation

## Base URL
All endpoints are prefixed with `/employees`.

---

### Get All Employees
**Endpoint:** `GET /`  
**Description:** Retrieves a list of all employees.

#### Response
- **200 OK**
  ```json
  [
      {
          "employee_id": 1,
          "name": "John Doe",
          "gender": "Male",
          "phone_number": "1234567890",
          "role": "Manager",
          "address": "123 Street Name",
          "aadhar_number": "123456789012",
          "date_of_joining": "2023-01-01",
          "salary": 50000.00
      },
      ...
  ]


#### **GET `/:id/:month` - Calculate Payable Salary for an Employee**

- **Description**: 
  This endpoint calculates the payable salary for an employee based on their attendance for the specified month.

- **Request Type**: `GET`

- **Parameters**:
  - **id**: (integer, required) The ID of the employee.
  - **month**: (integer, required) The month number (1-12) for which the salary is to be calculated.

- **Logic**:
  1. Fetches the counts of attendance statuses (`Present`, `Absent`, `On Leave`, `Holiday`) for the given employee in the specified month.
  2. Validates that the total days accounted for matches the total days in the month.
  3. If validation passes, calculates the net salary using:
     \[
     \text{Net Salary} = \text{Base Salary} - \left( \frac{\text{Base Salary}}{\text{Working Days}} \times \text{Absent Days} \right)
     \]
  4. Returns the calculated net salary.

- **Responses**:
  - **201**: Salary successfully calculated.
    - **Response JSON**:
      ```json
      {
          "payableSalary": "Calculated Salary"
      }
      ```
  - **400**: Premature checking if attendance data does not account for all days in the month.
    - **Response JSON**:
      ```json
      {
          "msg": "Premature checking for salary"
      }
      ```
  - **500**: Internal Server Error (if any unexpected error occurs).

- **Notes**:
  - Ensure attendance data is complete for the given month before hitting this endpoint.
  - The formula assumes that `On Leave` and `Holiday` days are not deducted from the salary.
  - Uses the `COUNT(date)` function in SQL to determine attendance counts.


# Documentation for Attendance Management Endpoints

## **1. GET `/:id/:month`**

### **Description**
Fetches attendance details (Present, Absent, Holiday, On Leave) for a specific employee in a given month.

---

### **Request Type**
`GET`

---

### **Path Parameters**
| Parameter | Type    | Description                           | Required |
|-----------|---------|---------------------------------------|----------|
| `id`      | integer | Employee ID                          | Yes      |
| `month`   | integer | Month number (1-12) to fetch details | Yes      |

---

### **Response**
#### **Success Response (201)**
- **Body**:
    ```json
    {
        "present": <count_of_present_days>,
        "absent": <count_of_absent_days>,
        "holidays": <count_of_holidays>,
        "onleave": <count_of_leave_days>
    }
    ```

#### **Error Response (501)**
- **Body**:
    ```json
    {
        "msg": "error in fetching data from the database"
    }
    ```

---

## **2. POST `/`**

### **Description**
Adds an attendance record for an employee for the current date.

---

### **Request Type**
`POST`

---

### **Request Body Parameters**
| Parameter      | Type    | Description                                         | Required |
|----------------|---------|-----------------------------------------------------|----------|
| `employee_id`  | integer | Employee ID                                         | Yes      |
| `status`       | string  | Attendance status (Present, Absent, Holiday, On Leave) | Yes      |

#### **Schema Validation (Joi)**
- **Rules**:
    ```javascript
    const schema = joi.object({
        employee_id: joi.number().integer().required(),
        status: joi.string().valid('Present', 'Absent', 'Holiday', 'On Leave').required()
    });
    ```

---

### **Response**
#### **Success Response (201)**
- **Body**:
    ```json
    {
        "msg": "successfully added attendance to the database"
    }
    ```

#### **Error Response**
- **Validation Error (500)**:
    ```json
    {
        "msg": "validation error"
    }
    ```
- **Database Update Error (501)**:
    ```json
    {
        "msg": "error in updation from the database"
    }
    ```

---

## **Error Handling**
- The `GET` endpoint returns `501` if there is an issue with fetching data.
- The `POST` endpoint validates request parameters using Joi and rejects invalid data with a `500` response.

---

## **Notes**
- The `POST` endpoint automatically sets the attendance date to the current system date.
- Ensure database connectivity to prevent backend errors.
