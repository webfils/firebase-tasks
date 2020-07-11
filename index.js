// Importar base de datos Firebase
const db = firebase.firestore();

const taskForm = document.getElementById('task-form');
const taskContainer = document.getElementById('tasks-container');

// Guardar tarea.
const saveTask = (title, description) =>
    // Colección de tareas.
    db.collection('tasks').doc().set({
        title,
        description
    })

// Obtener tareas.
const getTask = () => db.collection('tasks').get();
// Cargar contenido en la ventana.
window.addEventListener('DOMContentLoaded', async(e) => {
    // querySnapshot = Objeto a recorer.
    const querySnapshot = await getTask()
    querySnapshot.forEach(doc => {
        // console.log(doc.data())
        const task = doc.data()

        taskContainer.innerHTML +=
            `
                <div class="uk-card uk-card-primary uk-card-body">
                    <h3 class="uk-card-title">${task.title}</h3>
                    <p>${task.description}</p>
                    <ul class="uk-iconnav">
                        <li><button class="uk-button uk-button-link uk-button-edit" data-id="myId" uk-icon="icon: pencil;"></button></li>
                        <li><button class="uk-button uk-button-link uk-button-delete" uk-icon="icon: trash;"></button></li>
                    </ul>
                </div>
            `
            // Elemento boton borrar
        const buttonsDelete = document.querySelectorAll('.uk-button-delete')
        buttonsDelete.forEach(uk => {
            uk.addEventListener('click', (e) => {
                console.log(e.target)
            })
        })
    })
})

taskForm.addEventListener('submit', async(e) => {
    e.preventDefault()

    // Escuchando el valor.
    const title = taskForm['task-title'];
    const description = taskForm['task-description'];

    await saveTask(title.value, description.value)

    // Resetear formulario y posicionar cursor.
    taskForm.reset()
    title.focus()


    console.log(title, description);
})