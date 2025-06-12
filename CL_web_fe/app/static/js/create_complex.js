
document.addEventListener('DOMContentLoaded', function() {
    var parking = document.getElementById('parking');
    var parkingNumberGroup = document.getElementById('parkingNumberGroup');
    var storage = document.getElementById('storage');
    var storageNumberGroup = document.getElementById('storageNumberGroup');

    parking.addEventListener('change', function() {
        if (this.value === "1" || this.value === "2") {
            parkingNumberGroup.style.display = "block";
        } else {
            parkingNumberGroup.style.display = "none";
        }
    });

    storage.addEventListener('change', function() {
        if (this.value === "1") {
            storageNumberGroup.style.display = "block";
        } else {
            storageNumberGroup.style.display = "none";
        }
    });
});

document.addEventListener('DOMContentLoaded', function() {

    document.getElementById('submitBtn').addEventListener('click', function() {
        // Recolectar datos del formulario
        const form = document.getElementById('complexForm');
        const formData = new FormData(form);

        // Obtener amenidades seleccionadas
        const amenities = [];
        form.querySelectorAll('input[name="amenities"]:checked').forEach(cb => {
            amenities.push(cb.value);
        });

        // Construir el objeto de variables para GraphQL
        const variables = {
            complex_name: formData.get('complex_name'),
            address: formData.get('address'),
            department: formData.get('department'),
            city: formData.get('city'),
            amenities: amenities,
            parking: formData.get('parking'),
            parkingNumber: formData.get('parkingNumber'),
            storage: formData.get('storage'),
            storageNumber: formData.get('storageNumber')
        };

        // Construir la consulta GraphQL (ajusta los campos y la mutación según tu backend)
        const query = `
            mutation CreateComplex($complex_name: String!, $address: String!, $department: String!, $city: String!, $amenities: [String!], $parking: String!, $parkingNumber: String, $storage: String!, $storageNumber: String) {
                createComplex(
                    complex_name: $complex_name,
                    address: $address,
                    department: $department,
                    city: $city,
                    amenities: $amenities,
                    parking: $parking,
                    parkingNumber: $parkingNumber,
                    storage: $storage,
                    storageNumber: $storageNumber
                ) {
                    id
                    complex_name
                }
            }
        `;

        fetch('/graphql', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                query: query,
                variables: variables
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.errors) {
                alert('Error: ' + data.errors[0].message);
            } else {
                alert('¡Conjunto registrado con éxito!');
                // Opcional: limpiar el formulario o redirigir
                form.reset();
            }
        })
        .catch(error => {
            alert('Error en la petición: ' + error);
        });
    });
});
