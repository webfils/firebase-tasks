// Importar base de datos Firebase
const db = firebase.firestore();

const taskForm = document.getElementById('task-form');
const taskContainer = document.getElementById('tasks-container');

// Variable que almacena el estado de la aplicación
let editStatus = false;
let id = "";

// Guardar tarea.
const saveTask = (title, description) =>
    // Colección de tareas.
    db.collection('tasks').doc().set({
        title,
        description
    });

// Obtener tareas.
const getTasks = () => db.collection('tasks').get();
// Obtener tarea (singular)
const getTask = (id) => db.collection('tasks').doc(id).get();

// Eliminar tarea.
const deleteTask = id => db.collection('tasks').doc(id).delete();

// Actualizar tarea.
const updateTask = (id, updateTask) => db.collection('tasks').doc(id).update(updateTask);


// Nota: Cuando carga el navegador, voy agregar un escucha " onGetTasks ", 
// mostrara undato cada vez que cambie, que seran mostrados por el objeto " querySnapshot "
// y comenzara a recorrerlo voy añadiendo los datos.
const onGetTasks = (callback) => db.collection('tasks').onSnapshot(callback);

// Cargar contenido en la ventana. DOMContentLoaded = Solo se muestra cuando carga la página.
window.addEventListener('DOMContentLoaded', async(e) => {
    // querySnapshot = Objeto a recorer. Sin contenedor onGetTasks
    // const querySnapshot = await getTask();
    onGetTasks((querySnapshot) => {
        // No duplicar contenido.
        taskContainer.innerHTML = '';

        querySnapshot.forEach(doc => {
            // console.log(doc.data())

            const task = doc.data();
            // Visualizar el id
            task.id = doc.id;
            // console.log(task);

            taskContainer.innerHTML +=
                `
                    <div class="uk-card uk-card-primary uk-card-body">
                        <div>
                            <h3 class="uk-card-title">${task.title}</h3>
                            <p>${task.description}</p>
                        </div>
                        <div class="uk-flex uk-flex-between">
                            <button type="submit" class="uk-button uk-button-default uk-button-small uk-button-edit" data-id="${task.id}">editar</button>
                            <button type="submit" class="uk-button uk-button-default uk-button-small uk-button-delete" data-id="${task.id}">eliminar</button>
                        </div>
                    </div>
                `

            // clicks de multiples elementos
            // Acción borrar.
            const buttonsDelete = document.querySelectorAll('.uk-button-delete');
            // console.log(buttonsDelete);
            buttonsDelete.forEach(uk => {
                // Elemento al cual se le dio click.
                uk.addEventListener('click', async(e) => {
                    // propiedad dataset = 
                    // console.log(e.target.dataset.id);
                    await deleteTask(e.target.dataset.id);
                });
            });

            // Acción Editar
            const buttonsEdit = document.querySelectorAll('.uk-button-edit');
            buttonsEdit.forEach(uk => {
                // Al hacer click consultamos los datos.
                uk.addEventListener('click', async(e) => {
                    // console.log(e.target.dataset.id);

                    // Devuelve objeto de firebase.
                    // const task = await getTask(e.target.dataset.id);
                    const doc = await getTask(e.target.dataset.id);
                    // console.log(doc.data());
                    const task = doc.data()

                    // Al activar el boton editar cambiara el status a true.
                    editStatus = true;
                    id = doc.id;

                    // taskForm['task-title'].value = doc.data().title;
                    taskForm['task-title'].value = task.title;
                    taskForm['task-description'].value = task.description;

                    taskForm['button-task-form'].innerText = 'update';
                });
            });
        });
    });
});

taskForm.addEventListener('submit', async(e) => {
    e.preventDefault()

    // Escuchando el valor.
    const title = taskForm['task-title'];
    const description = taskForm['task-description'];

    // await saveTask(title.value, description.value);
    if (!editStatus) {
        await saveTask(title.value, description.value);
    } else {
        // taskForm['button-task-form'].innerText = 'update';

        // Acción de actualizar contenido.
        await updateTask(id, {
            title: title.value,
            description: description.value
        });
        // Boton vuelve al estado original
        editStatus = false;
        id = "";
        taskForm['button-task-form'].innerText = 'Guardar'
    }

    // Resetear formulario y posicionar cursor.
    taskForm.reset();
    title.focus();


    console.log(title, description);
})