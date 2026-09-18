/* =========================================================
   API
========================================================= */

const API = "/api/employees";


/* =========================================================
   GLOBAL VARIABLES
========================================================= */

let employees = [];

let departmentChart = null;

let salaryChart = null;

let growthChart = null;


/* =========================================================
   PAGE LOAD
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        loadEmployees();

        document
            .getElementById("employeeForm")
            .addEventListener(
                "submit",
                saveEmployee
            );

    }
);


/* =========================================================
   LOAD EMPLOYEES
========================================================= */

async function loadEmployees() {

    try {

        const response =
            await fetch(API);


        if (!response.ok) {

            throw new Error(
                "Unable to load employees"
            );

        }


        employees =
            await response.json();


        renderAll();


    } catch (error) {

        console.error(error);

        toast(
            "Unable to connect to Spring Boot"
        );

    }

}


/* =========================================================
   RENDER EVERYTHING
========================================================= */

function renderAll() {

    renderStats();

    populateFilters();

    renderCharts();

    renderRecentActivity();

    renderEmployeeTable(
        employees
    );

    renderDepartments();

}


/* =========================================================
   STATISTICS
========================================================= */

function renderStats() {

    const total =
        employees.length;


    document.getElementById(
        "totalEmployees"
    ).textContent = total;


    document.getElementById(
        "growthTotal"
    ).textContent = total;


    /* Departments */

    const departments = [
        ...new Set(
            employees
                .map(e => e.department)
                .filter(Boolean)
        )
    ];


    document.getElementById(
        "totalDepartments"
    ).textContent =
        departments.length;


    /* Average Salary */

    const salaries =
        employees
            .map(e => Number(e.salary))
            .filter(
                value =>
                    Number.isFinite(value)
            );


    const average =
        salaries.length
            ? salaries.reduce(
                (a, b) => a + b,
                0
            ) / salaries.length
            : 0;


    document.getElementById(
        "averageSalary"
    ).textContent =
        formatCurrency(average);


    /*
       Display a small database-based
       change indicator.
    */

    document.getElementById(
        "employeeChange"
    ).textContent =
        Math.min(total, 8);

}


/* =========================================================
   FILTERS
========================================================= */

function populateFilters() {

    const departments = [
        ...new Set(
            employees
                .map(e => e.department)
                .filter(Boolean)
        )
    ].sort();


    const filterIds = [

        "departmentFilter",

        "departmentFilter2",

        "chartDept"

    ];


    filterIds.forEach(
        function (id) {

            const select =
                document.getElementById(id);


            if (!select) {
                return;
            }


            select.innerHTML = "";


            const option =
                document.createElement(
                    "option"
                );


            option.value = "";

            option.textContent =
                "All Departments";


            select.appendChild(
                option
            );


            departments.forEach(
                function (department) {

                    const option =
                        document.createElement(
                            "option"
                        );


                    option.value =
                        department;

                    option.textContent =
                        department;


                    select.appendChild(
                        option
                    );

                }
            );

        }
    );

}


/* =========================================================
   CHARTS
========================================================= */

function renderCharts() {

    renderDepartmentChart();

    renderSalaryChart();

    renderGrowthChart();

}


/* =========================================================
   DEPARTMENT DOUGHNUT
========================================================= */

function renderDepartmentChart() {

    const counts = {};


    employees.forEach(
        function (employee) {

            const department =
                employee.department ||
                "Unknown";


            counts[department] =
                (counts[department] || 0)
                + 1;

        }
    );


    const labels =
        Object.keys(counts);


    const data =
        Object.values(counts);


    const canvas =
        document.getElementById(
            "departmentChart"
        );


    if (departmentChart) {

        departmentChart.destroy();

    }


    departmentChart =
        new Chart(
            canvas,
            {

                type: "doughnut",

                data: {

                    labels: labels,

                    datasets: [

                        {

                            data: data,

                            borderWidth: 4,

                            borderColor:
                                "#ffffff",

                            backgroundColor: [

                                "#2563eb",

                                "#7557e8",

                                "#36c98f",

                                "#f5a83b",

                                "#f05b64",

                                "#8994a7"

                            ]

                        }

                    ]

                },


                options: {

                    responsive: true,

                    maintainAspectRatio: false,

                    cutout: "67%",

                    plugins: {

                        legend: {

                            display: false

                        }

                    }

                }

            }
        );


    /* LEGEND */

    const legend =
        document.getElementById(
            "legend"
        );


    const colors = [

        "#2563eb",

        "#7557e8",

        "#36c98f",

        "#f5a83b",

        "#f05b64",

        "#8994a7"

    ];


    legend.innerHTML = "";


    labels.forEach(
        function (label, index) {

            const row =
                document.createElement(
                    "div"
                );


            row.className =
                "legend-row";


            row.innerHTML = `

                <span
                    class="dot"
                    style="
                        background:
                        ${colors[index % colors.length]}
                    "
                ></span>

                ${escapeHTML(label)}

                <b>
                    ${data[index]}
                </b>

            `;


            legend.appendChild(row);

        }
    );

}


/* =========================================================
   SALARY CHART
========================================================= */

function renderSalaryChart() {

    const departmentData = {};


    employees.forEach(
        function (employee) {

            const department =
                employee.department ||
                "Unknown";


            const salary =
                Number(employee.salary) || 0;


            if (!departmentData[department]) {

                departmentData[department] = {

                    total: 0,

                    count: 0

                };

            }


            departmentData[
                department
            ].total += salary;


            departmentData[
                department
            ].count++;

        }
    );


    const labels =
        Object.keys(
            departmentData
        );


    const data =
        labels.map(
            function (department) {

                const item =
                    departmentData[
                        department
                    ];


                return Math.round(
                    item.total /
                    item.count
                );

            }
        );


    const canvas =
        document.getElementById(
            "salaryChart"
        );


    if (salaryChart) {

        salaryChart.destroy();

    }


    salaryChart =
        new Chart(
            canvas,
            {

                type: "bar",

                data: {

                    labels: labels,

                    datasets: [

                        {

                            data: data,

                            borderRadius: 5,

                            backgroundColor: [

                                "#4d91f7",

                                "#8268ed",

                                "#50cfa0",

                                "#f5b55a",

                                "#f06a70",

                                "#94a0b2"

                            ]

                        }

                    ]

                },


                options: {

                    responsive: true,

                    maintainAspectRatio: false,

                    plugins: {

                        legend: {

                            display: false

                        }

                    },


                    scales: {

                        y: {

                            beginAtZero: true,

                            grid: {

                                color:
                                    "#edf0f5"

                            },

                            ticks: {

                                font: {

                                    size: 8

                                },

                                callback:
                                    function (value) {

                                        return "₹" +
                                            Math.round(
                                                value /
                                                1000
                                            ) +
                                            "K";

                                    }

                            }

                        },


                        x: {

                            grid: {

                                display: false

                            },

                            ticks: {

                                font: {

                                    size: 8

                                }

                            }

                        }

                    }

                }

            }
        );

}


/* =========================================================
   EMPLOYEE GROWTH
========================================================= */

function renderGrowthChart() {

    /*
       Convert joining dates into JavaScript
       Date objects.
    */

    const validDates =
        employees

            .map(
                employee =>
                    new Date(
                        employee.joiningDate
                    )
            )

            .filter(
                date =>
                    !isNaN(date)
            )

            .sort(
                (a, b) =>
                    a - b
            );


    /*
       Group employees by month.
    */

    const monthly =
        {};


    validDates.forEach(
        function (date) {

            const key =
                date.getFullYear() +
                "-" +
                String(
                    date.getMonth() + 1
                ).padStart(2, "0");


            monthly[key] =
                (monthly[key] || 0)
                + 1;

        }
    );


    const labels =
        Object.keys(monthly)
            .sort();


    /*
       Calculate cumulative
       employee count.
    */

    let total = 0;


    const data =
        labels.map(
            function (month) {

                total +=
                    monthly[month];

                return total;

            }
        );


    /*
       Growth percentage
    */

    let growthPercentage = 0;


    if (data.length > 1) {

        const first =
            data[0];


        const last =
            data[data.length - 1];


        if (first > 0) {

            growthPercentage =
                (
                    (last - first) /
                    first
                ) * 100;

        }

    }


    document.getElementById(
        "growthPercent"
    ).textContent =
        "+" +
        growthPercentage.toFixed(1) +
        "%";


    /*
       Create chart
    */

    const canvas =
        document.getElementById(
            "growthChart"
        );


    if (growthChart) {

        growthChart.destroy();

    }


    growthChart =
        new Chart(
            canvas,
            {

                type: "line",

                data: {

                    labels: labels,

                    datasets: [

                        {

                            label:
                                "Employees",

                            data: data,

                            fill: true,

                            tension: .4,

                            borderWidth: 2,

                            borderColor:
                                "#2563eb",

                            backgroundColor:
                                "rgba(37,99,235,.12)",

                            pointRadius: 2,

                            pointHoverRadius: 5,

                            pointBackgroundColor:
                                "#2563eb"

                        }

                    ]

                },


                options: {

                    responsive: true,

                    maintainAspectRatio: false,


                    plugins: {

                        legend: {

                            display: false

                        }

                    },


                    scales: {

                        y: {

                            beginAtZero: true,

                            grid: {

                                color:
                                    "#edf0f5"

                            },

                            ticks: {

                                font: {

                                    size: 8

                                },

                                precision: 0

                            }

                        },


                        x: {

                            grid: {

                                display: false

                            },

                            ticks: {

                                font: {

                                    size: 8

                                }

                            }

                        }

                    }

                }

            }
        );

}


/* =========================================================
   EMPLOYEE TABLE
========================================================= */

function renderEmployeeTable(list) {

    const table =
        document.getElementById(
            "employeeTableBody"
        );


    const table2 =
        document.getElementById(
            "employeeTableBody2"
        );


    const html =
        list.map(
            function (employee) {

                return `

                <tr>

                    <td>
                        <input type="checkbox">
                    </td>


                    <td>

                        <div class="person">

                            <div class="person-avatar">

                                ${getInitials(
                                    employee.name
                                )}

                            </div>


                            <div>

                                <b>
                                    ${escapeHTML(
                                        employee.name
                                    )}
                                </b>

                                <small>
                                    ${escapeHTML(
                                        employee.email
                                    )}
                                </small>

                            </div>

                        </div>

                    </td>


                    <td>
                        ${escapeHTML(
                            employee.designation
                        )}
                    </td>


                    <td>
                        ${escapeHTML(
                            employee.department
                        )}
                    </td>


                    <td>

                        <span
                            class="status active-status"
                        >
                            ↑ Active
                        </span>

                    </td>


                    <td>
                        ${formatDate(
                            employee.joiningDate
                        )}
                    </td>


                    <td>

                        <div class="actions">

                            <button
                                class="action"
                                onclick="
                                    editEmployee(
                                        ${employee.id}
                                    )
                                "
                            >
                                ✎
                            </button>


                            <button
                                class="action"
                                onclick="
                                    deleteEmployee(
                                        ${employee.id}
                                    )
                                "
                            >
                                🗑
                            </button>

                        </div>

                    </td>

                </tr>

                `;

            }
        ).join("");


    if (table) {

        table.innerHTML =
            html;

    }


    if (table2) {

        table2.innerHTML =
            html;

    }


    const empty =
        document.getElementById(
            "emptyState"
        );


    if (empty) {

        empty.style.display =
            list.length
                ? "none"
                : "block";

    }

}


/* =========================================================
   SEARCH / FILTER
========================================================= */

function applyFilters() {

    const search =
        (
            document.getElementById(
                "searchInput"
            ).value || ""
        ).toLowerCase();


    const department =
        document.getElementById(
            "departmentFilter"
        ).value;


    const filtered =
        employees.filter(
            function (employee) {

                const searchable =

                    (
                        employee.name || ""
                    ) +

                    " " +

                    (
                        employee.email || ""
                    ) +

                    " " +

                    (
                        employee.designation || ""
                    ) +

                    " " +

                    (
                        employee.department || ""
                    );


                const matchesSearch =
                    searchable
                        .toLowerCase()
                        .includes(search);


                const matchesDepartment =
                    !department ||
                    employee.department ===
                    department;


                return (
                    matchesSearch &&
                    matchesDepartment
                );

            }
        );


    renderEmployeeTable(
        filtered
    );

}


/* =========================================================
   GLOBAL SEARCH
========================================================= */

function globalSearch() {

    const value =
        document.getElementById(
            "globalSearch"
        ).value;


    document.getElementById(
        "searchInput"
    ).value = value;


    showSection(
        "employees"
    );


    applyFilters();

}


/* =========================================================
   SEARCH PAGE SYNC
========================================================= */

function syncSearch(value) {

    document.getElementById(
        "searchInput"
    ).value = value;


    showSection(
        "employees"
    );


    applyFilters();

}


/* =========================================================
   DEPARTMENT SYNC
========================================================= */

function syncDept(value) {

    document.getElementById(
        "departmentFilter"
    ).value = value;


    applyFilters();

}


/* =========================================================
   RECENT ACTIVITY
========================================================= */

function renderRecentActivity() {

    const container =
        document.getElementById(
            "recentActivity"
        );


    const recent =
        employees
            .slice()
            .reverse()
            .slice(0, 5);


    container.innerHTML =
        recent.map(
            function (employee) {

                return `

                <div class="activity-row">

                    <div class="activity-icon">
                        +
                    </div>


                    <div class="activity-info">

                        <b>
                            Employee Added
                        </b>

                        <small>
                            ${escapeHTML(
                                employee.name
                            )}
                        </small>

                    </div>


                    <span class="activity-time">

                        ${formatDate(
                            employee.joiningDate
                        )}

                    </span>

                </div>

                `;

            }
        ).join("");

}


/* =========================================================
   DEPARTMENTS
========================================================= */

function renderDepartments() {

    const container =
        document.getElementById(
            "departmentCards"
        );


    const departments =
        {};


    employees.forEach(
        function (employee) {

            const department =
                employee.department ||
                "Unknown";


            departments[department] =
                (
                    departments[department] ||
                    0
                ) + 1;

        }
    );


    container.innerHTML =
        Object.entries(
            departments
        )
        .map(
            function (
                [
                    department,
                    count
                ]
            ) {

                return `

                <div class="department-card">

                    <h3>
                        ${escapeHTML(
                            department
                        )}
                    </h3>


                    <p>
                        Active employees
                    </p>


                    <strong>
                        ${count}
                    </strong>

                </div>

                `;

            }
        )
        .join("");

}


/* =========================================================
   ADD EMPLOYEE
========================================================= */

function openAddModal() {

    document
        .getElementById(
            "employeeForm"
        )
        .reset();


    document
        .getElementById(
            "employeeId"
        )
        .value = "";


    document
        .getElementById(
            "modalTitle"
        )
        .textContent =
        "Add Employee";


    document
        .getElementById(
            "employeeModal"
        )
        .classList.add(
            "show"
        );

}


/* =========================================================
   EDIT EMPLOYEE
========================================================= */

function editEmployee(id) {

    const employee =
        employees.find(
            function (item) {

                return item.id === id;

            }
        );


    if (!employee) {

        return;

    }


    document.getElementById(
        "employeeId"
    ).value =
        employee.id;


    document.getElementById(
        "name"
    ).value =
        employee.name || "";


    document.getElementById(
        "email"
    ).value =
        employee.email || "";


    document.getElementById(
        "phone"
    ).value =
        employee.phone || "";


    document.getElementById(
        "department"
    ).value =
        employee.department || "";


    document.getElementById(
        "designation"
    ).value =
        employee.designation || "";


    document.getElementById(
        "salary"
    ).value =
        employee.salary || "";


    document.getElementById(
        "joiningDate"
    ).value =
        employee.joiningDate || "";


    document.getElementById(
        "modalTitle"
    ).textContent =
        "Edit Employee";


    document
        .getElementById(
            "employeeModal"
        )
        .classList.add(
            "show"
        );

}


/* =========================================================
   SAVE EMPLOYEE
========================================================= */

async function saveEmployee(event) {

    event.preventDefault();


    const id =
        document.getElementById(
            "employeeId"
        ).value;


    const employee = {

        name:
            document
                .getElementById("name")
                .value
                .trim(),

        email:
            document
                .getElementById("email")
                .value
                .trim(),

        phone:
            document
                .getElementById("phone")
                .value
                .trim(),

        department:
            document
                .getElementById("department")
                .value
                .trim(),

        designation:
            document
                .getElementById("designation")
                .value
                .trim(),

        salary:
            Number(
                document
                    .getElementById("salary")
                    .value
            ),

        joiningDate:
            document
                .getElementById("joiningDate")
                .value

    };


    try {

        const response =
            await fetch(
                id
                    ? `${API}/${id}`
                    : API,
                {

                    method:
                        id
                            ? "PUT"
                            : "POST",

                    headers: {

                        "Content-Type":
                            "application/json"

                    },

                    body:
                        JSON.stringify(
                            employee
                        )

                }
            );


        if (!response.ok) {

            throw new Error(
                "Failed to save"
            );

        }


        closeModal();


        toast(
            id
                ? "Employee updated successfully"
                : "Employee added successfully"
        );


        await loadEmployees();


    } catch (error) {

        console.error(error);

        toast(
            "Could not save employee"
        );

    }

}


/* =========================================================
   DELETE
========================================================= */

async function deleteEmployee(id) {

    const confirmed =
        confirm(
            "Are you sure you want to delete this employee?"
        );


    if (!confirmed) {

        return;

    }


    try {

        const response =
            await fetch(
                `${API}/${id}`,
                {

                    method: "DELETE"

                }
            );


        if (!response.ok) {

            throw new Error();

        }


        toast(
            "Employee deleted successfully"
        );


        await loadEmployees();


    } catch (error) {

        toast(
            "Could not delete employee"
        );

    }

}


/* =========================================================
   MODAL
========================================================= */

function closeModal() {

    document
        .getElementById(
            "employeeModal"
        )
        .classList.remove(
            "show"
        );

}


window.addEventListener(
    "click",
    function (event) {

        const modal =
            document.getElementById(
                "employeeModal"
            );


        if (
            event.target === modal
        ) {

            closeModal();

        }

    }
);


/* =========================================================
   NAVIGATION
========================================================= */

function showSection(section) {

    const sections = [

        "dashboard",

        "employees",

        "departments"

    ];


    sections.forEach(
        function (name) {

            const element =
                document.getElementById(
                    name + "Section"
                );


            if (element) {

                element.classList.toggle(
                    "hidden",
                    name !== section
                );

            }

        }
    );


    const navItems =
        document.querySelectorAll(
            ".nav"
        );


    navItems.forEach(
        item =>
            item.classList.remove(
                "active"
            )
    );


    const index = {

        dashboard: 0,

        employees: 1,

        departments: 2

    };


    if (
        navItems[index[section]]
    ) {

        navItems[index[section]]
            .classList.add(
                "active"
            );

    }

}


/* =========================================================
   MOBILE SIDEBAR
========================================================= */

function toggleSidebar() {

    document
        .querySelector(
            ".sidebar"
        )
        .classList.toggle(
            "open"
        );

}


/* =========================================================
   HELPERS
========================================================= */

function formatCurrency(value) {

    const number =
        Number(value) || 0;


    return "₹" +
        Math.round(
            number
        ).toLocaleString(
            "en-IN"
        );

}


function formatDate(value) {

    if (!value) {

        return "-";

    }


    const date =
        new Date(value);


    if (isNaN(date)) {

        return value;

    }


    return date.toLocaleDateString(
        "en-IN",
        {

            day: "2-digit",

            month: "short",

            year: "numeric"

        }
    );

}


function getInitials(name) {

    if (!name) {

        return "?";

    }


    return name

        .split(" ")

        .filter(Boolean)

        .slice(0, 2)

        .map(
            word =>
                word[0]
                    .toUpperCase()
        )

        .join("");

}


function escapeHTML(value) {

    return String(
        value ?? ""
    ).replace(
        /[&<>"']/g,
        function (character) {

            return {

                "&": "&amp;",

                "<": "&lt;",

                ">": "&gt;",

                '"': "&quot;",

                "'": "&#039;"

            }[character];

        }
    );

}


/* =========================================================
   TOAST
========================================================= */

function toast(message) {

    const element =
        document.getElementById(
            "toast"
        );


    element.textContent =
        message;


    element.classList.add(
        "show"
    );


    setTimeout(
        function () {

            element.classList.remove(
                "show"
            );

        },
        2500
    );

}