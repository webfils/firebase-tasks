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


// Nota: Cuando carga el navegador, voy agregar un escucha " onGetTasks ", 
// mostrara undato cada vez que cambie, que seran mostrados por el objeto " querySnapshot "
// y comenzara a recorrerlo voy añadiendo los datos.
const onGetTasks = (callback) => db.collection('tasks').onSnapshot(callback);

// Cargar contenido en la ventana. DOMContentLoaded = Solo se muestra cuando carga la página.
window.addEventListener('DOMContentLoaded', async(e) => {
    // No duplicar contenido.
    taskContainer.innerHTML = '';
    // querySnapshot = Objeto a recorer. Sin contenedor onGetTasks
    // const querySnapshot = await getTask();
    onGetTasks((querySnapshot) => {
        querySnapshot.forEach(doc => {
            console.log(doc.data())
            const task = doc.data()

            taskContainer.innerHTML +=
                `
                    <div class="uk-card uk-card-primary uk-card-body">
                        <h3 class="uk-card-title">${task.title}</h3>
                        <p>${task.description}</p>
                        <ul class="uk-iconnav">
                            <li><a href="#" class="uk-icon-link" uk-icon="icon: pencil;"></a></li>
                            <li><a href="#" class="uk-icon-link" uk-icon="icon: trash;"></a></li>
                        </ul>
                    </div>
                `
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