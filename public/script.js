$(document).ready(function() {
    // Registro de un nuevo club
    $('#registerForm').on('submit', function(event) {
        event.preventDefault();

        // Obtener valores de los campos del formulario
        const nickClub = $('#username').val();
        const password1 = $('#password1').val();
        const password2 = $('#password2').val();

        // Validación de usuario (máximo 20 caracteres)
        if (nickClub.length > 20) {
            $('#response').text('El usuario debe tener un máximo de 20 caracteres.');
            return;
        }

        // Validación de contraseña (entre 8-20 caracteres, mayúscula, minúscula, número y especial)
        const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,20}$/;
        if (!passwordPattern.test(password1)) {
            $('#response').text('La contraseña debe tener entre 8 y 20 caracteres, con al menos una letra mayúscula, una minúscula, un número y un carácter especial.');
            return;
        }

        // Validación de coincidencia de contraseñas
        if (password1 !== password2) {
            $('#response').text('Las contraseñas no coinciden.');
            return;
        }

        // Verificar si el nickClub ya existe en el servidor
        $.ajax({
            url: 'http://localhost:3000/clubes', 
            type: 'GET',
            success: function(response) {
                const usuarioExistente = response.some(club => club.nick_club === nickClub);
               
                if (usuarioExistente) {
                    $('#response').text('Usuario existente. Intenta con otro nombre de usuario.');
                } else {
                    // Si no existe, proceder con el registro
                    const data = {
                        nick_club: nickClub,
                        password_club: password1
                    };

                    $.ajax({
                        url: 'http://localhost:3000/clubes',
                        type: 'POST',
                        contentType: 'application/json',
                        data: JSON.stringify(data),
                        success: function(response) {
                            $('#response').text('Registro exitoso');
                            mostrarClub(); // Actualizar la lista de clubes
                        },
                        error: function() {
                            $('#response').text('Error al registrar.');
                        }
                    });
                }
            },
            error: function() {
                $('#response').text('Error al verificar el nombre de usuario.');
            }
        });
    });

    // Inicio de sesión
    $('.form-lg').on('submit', function(event) {
        event.preventDefault();

        // Obtener valores de usuario y contraseña
        const usuario = $('.usuario-2').val();
        const password = $('.password-2').val();

        // Validación de usuario (máximo 20 caracteres)
        if (usuario.length > 20) {
            alert('El usuario debe tener un máximo de 20 caracteres.');
            return;
        }

        // Validación de contraseña (entre 8-20 caracteres, mayúscula, minúscula, número y especial)
        const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,20}$/;
        if (!passwordPattern.test(password)) {
            alert('La contraseña debe tener entre 8 y 20 caracteres, con al menos una letra mayúscula, una minúscula, un número y un carácter especial.');
            return;
        }

        // Verificar usuario y contraseña en el servidor
        $.get('http://localhost:3000/clubes', function(response) {
            let usuarioEncontrado = false;
            response.forEach(club => {
                if (club.nick_club === usuario && club.password_club === password) {
                    usuarioEncontrado = true;
                }
            });

            if (usuarioEncontrado) {
                alert('Inicio de sesión exitoso.');
                window.location.href = 'eliminar.html';
            } else {
                alert('Usuario o contraseña incorrectos.');
            }
        }).fail(function() {
            alert('Error al cargar los datos de usuarios.');
        });
    });
});

///////////////////////////////////////////////////////////////////////

// Función para mostrar la lista de clubes
function mostrarClub() {
    const url = 'http://localhost:3000/clubes';
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
            var response = JSON.parse(xhr.responseText);
            crearListaClubes(response);
        } else if (xhr.readyState === 4) {
            console.error("Error al cargar los clubes:", xhr.status, xhr.statusText);
        }
    };
    xhr.send();
}

// Crear lista de clubes en el DOM
function crearListaClubes(clubes) {
    const lista = document.getElementById('lista-clubes');
    lista.innerHTML = ''; // Limpiar lista existente
    clubes.forEach(club => {
        const listItem = document.createElement('li');
        listItem.textContent = `Nick del club: ${club.nick_club} (ID: ${club.id}) `;

        // Crear botón de eliminar
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Eliminar';
        deleteButton.setAttribute('data-id', club.id);

        deleteButton.onclick = function() {
            const confirmacion = prompt('Para confirmar la eliminación, escribe "CONFIRMAR":');
            if (confirmacion === "CONFIRMAR") {
                borrarClub(this.getAttribute('data-id'));
            } else {
                alert("El club no se ha eliminado. La palabra de confirmación no coincide.");
            }
        };

        listItem.appendChild(deleteButton);
        lista.appendChild(listItem);
    });
}

// Función para eliminar un club
function borrarClub(id) {
    const url = `http://localhost:3000/clubes/${id}`;
    var xhr = new XMLHttpRequest();
    xhr.open('DELETE', url, true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                mostrarClub();
            } else {
                console.error("Error al eliminar el club:", xhr.status, xhr.statusText);
                alert("No se pudo eliminar el club. Intenta nuevamente.");
            }
        }
    };
    xhr.send();
}

// Función para actualizar la lista de clubes en el servidor
function actualizarClubes(nuevosClubes) {
    const url = 'http://localhost:3000/clubes';
    var xhr = new XMLHttpRequest();
    xhr.open('PUT', url, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                mostrarClub(); 
            } else {
                console.error("Error al actualizar los clubes:", xhr.status, xhr.statusText);
            }
        }
    };
    xhr.send(JSON.stringify(nuevosClubes));
}

///////////////////////////////////////////////////////////////////////

// Animaciones de formulario
const registerButton = document.getElementById("register");
const loginButton = document.getElementById("login");
const container = document.getElementById("container");

// Alternar panel activo al registro
registerButton.addEventListener("click", () => {
  container.classList.add("right-panel-active");
});

// Alternar panel activo al login
loginButton.addEventListener("click", () => {
  container.classList.remove("right-panel-active");
});

// Validación de formulario de registro
const form = document.querySelector('form')
const username = document.getElementById('username')
const usernameError = document.querySelector("#username-error")
const email = document.getElementById('email')
const emailError = document.querySelector("#email-error")
const password = document.getElementById('password')
const passwordError = document.querySelector("#password-error")

// Mostrar mensaje de error
function showError(input, message) {
    const formControl = input.parentElement
    formControl.className = 'form-control error'
    const small = formControl.querySelector('small')
    small.innerText = message
}

// Mostrar éxito en la validación
function showSuccess(input) {
    const formControl = input.parentElement
    formControl.className = 'form-control success'
    const small = formControl.querySelector('small')
    small.innerText = ''
}

// Validar formato de email
function checkEmail(email) {
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    return emailRegex.test(email);
}

email.addEventListener("input", function(){
    if (!checkEmail(email.value)) {
        emailError.textContent = "*Email is not valid"
    }else {
        emailError.textContent = "";
    }
})

// Validación de longitud del nombre de usuario
username.addEventListener("input", function(){
    if (username.value.length < 4) {
        usernameError.textContent = "*Username must be at least 8 characters."
    }else if(username.value.length > 20){
        usernameError.textContent = "*Username must be less than 20 characters.";
    }else {
        usernameError.textContent = "";
    }
})

// Validación de longitud de la contraseña
password.addEventListener("input", function(){
    if (password.value.length < 8) {
        passwordError.textContent = "*Password must be at least 8 characters."
    }else if(password.value.length > 20){
        passwordError.textContent = "*Password must be less than 20 characters.";
    }else {
        passwordError.textContent = "";
    }
})
