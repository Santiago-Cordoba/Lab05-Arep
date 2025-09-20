const API_URL = "http://ec2-54-88-199-179.compute-1.amazonaws.com:8080/api/properties"; // Cambia la URL si está en AWS

document.addEventListener("DOMContentLoaded", () => {
    loadProperties();

    document.getElementById("propertyForm").addEventListener("submit", (e) => {
        e.preventDefault();
        const id = document.getElementById("propertyId").value;
        if (id) {
            updateProperty(id);
        } else {
            createProperty();
        }
    });
});

// Obtener todas las propiedades
async function loadProperties() {
    const response = await fetch(API_URL);
    const properties = await response.json();
    const tbody = document.querySelector("#propertiesTable tbody");
    tbody.innerHTML = "";

    properties.forEach(p => {
        const row = `
            <tr>
                <td>${p.id}</td>
                <td>${p.address}</td>
                <td>$${p.price}</td>
                <td>${p.size} m²</td>
                <td>${p.description}</td>
                <td>
                    <button onclick="editProperty(${p.id})">✏️ Edit</button>
                    <button onclick="deleteProperty(${p.id})">🗑️ Delete</button>
                </td>
            </tr>
        `;
        tbody.innerHTML += row;
    });
}

// Crear nueva propiedad
async function createProperty() {
    const property = getFormData();
    await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(property)
    });
    resetForm();
    loadProperties();
}

// Editar propiedad (cargar datos en el formulario)
async function editProperty(id) {
    const response = await fetch(`${API_URL}/${id}`);
    const property = await response.json();

    document.getElementById("propertyId").value = property.id;
    document.getElementById("address").value = property.address;
    document.getElementById("price").value = property.price;
    document.getElementById("size").value = property.size;
    document.getElementById("description").value = property.description;
}

// Actualizar propiedad
async function updateProperty(id) {
    const property = getFormData();
    property.id = id;
    await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(property)
    });
    resetForm();
    loadProperties();
}

// Eliminar propiedad
async function deleteProperty(id) {
    if (confirm("Are you sure you want to delete this property?")) {
        await fetch(`${API_URL}/${id}`, { method: "DELETE" });
        loadProperties();
    }
}

// Obtener datos del formulario
function getFormData() {
    return {
        address: document.getElementById("address").value,
        price: document.getElementById("price").value,
        size: document.getElementById("size").value,
        description: document.getElementById("description").value
    };
}

// Limpiar formulario
function resetForm() {
    document.getElementById("propertyId").value = "";
    document.getElementById("propertyForm").reset();
}
