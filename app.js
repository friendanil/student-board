const form = document.getElementById("form")
const typeKey = 'student_of_mentorfriends'

form.addEventListener('submit', (e) => {
    e.preventDefault()
    // console.log('btn clicked!')

    const formData = new FormData(form);
    const fname = formData.get('firstName')
    const lname = formData.get('lastName')
    const email = formData.get('studentEmail')
    const password = formData.get('studentPassword')
    // console.log(formData)
    // console.log(fname)

    // create student account
    // https://apitest.boomconcole.com/api/auth/signup

    const data = {
        student_of_mentorfriends:{
            fname,
            lname,
            email,
            password
        }
    }

    createAccount(JSON.stringify(data))
})

const createAccount = data => {
    fetch(`https://apitest.boomconcole.com/api/createApiWithoutAuth`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: data,
    })
    .then(res => res.json())
    .then(data => {
        // console.log(data)
        form.reset()
        listAccount()
    })
}

const listAccount = async (data) => {
    const studentData = []
    const response = await fetch(`https://apitest.boomconcole.com/api/list-api-clean?type=${typeKey}`)
        .then(response => response.json())
        .then(data => {
            // console.log('listAccount response:', data)
            
            data.forEach(data => {
                console.log('data', data)
                const obj = {
                    fullName: `${data.data.student_of_mentorfriends.fname} ${data.data.student_of_mentorfriends.lname}`,
                    email: data.data.student_of_mentorfriends.email,
                    password: data.data.student_of_mentorfriends.password,
                    id: data.id
                }

                studentData.push(obj)
            })
        })
    
    loadData(studentData)
}

const loadData = data => {
    // console.log(data)
    const division = []
    data.forEach(data => {
        const section = `
        <div class="card col col-4 student-info">
            <div class="card-body">
                <form id="form-edit">
                    <div class="mb-3 d-none">
                        <label for="studentId" class="form-label">Student's Id:</label>
                        <input type="text" class="form-control" id="studentId" name="studentId" value="${data.id}" disabled required>
                    </div>
                    <div class="mb-3">
                        <label for="fullName" class="form-label">Student's Full Name:</label>
                        <input type="text" class="form-control" id="fullName" name="fullName" value="${data.fullName}" disabled required>
                    </div>
                    <div class="mb-3">
                        <label for="studentEmail" class="form-label">Email address</label>
                        <input type="email" class="form-control" id="studentEmail" name="studentEmail" value="${data.email}" required disabled>
                    </div>
                    <div class="mb-3">
                        <label for="studentPassword" class="form-label">Student's Password:</label>
                        <input type="password" class="form-control" id="studentPassword" name="studentPassword" value="${data.password}" required disabled>
                    </div>
                
                    <button type="submit" class="btn btn-primary btn-edit">Edit</button>

                </form>
                
                <!-- <p>Student's Full Name: ${data.fullName}</p>
                <p>Student's Email: ${data.email}</p>
                <p>Student's Password: ${data.password}</p>
                <button type="submit" class="btn btn-primary btn-edit">Edit</button> -->
            </div>
        </div>
        `
        division.push(section)
    })
    document.querySelector('#student-list .row').innerHTML = division.join('')
    editInfo()
}

listAccount()

const editInfo = () => {
    const infos = document.querySelectorAll('.student-info button')
    // console.log('student-info', infos)
    let form = ''

    infos.forEach(studentInfo => {
        studentInfo.addEventListener('click', (e) => {
            e.preventDefault()
            // console.log('edit clicked', e)
            const editForm = e.target.parentElement
            // console.log('editForm', editForm)
            // form = editForm.querySelector('#form-edit')
            const inputs = editForm.querySelectorAll('.form-control')
            inputs.forEach(input => {
                console.log('input', input)
                input.removeAttribute('disabled')
            })
            // console.log('form', form)
            const btn = editForm.querySelector('button')
            btn.innerText = 'Save'
            btn.classList.add('btn-success')

            editCard(editForm)
        })
    })

    
}

const editCard = (form) => {
    // console.log('editCard', form)
    const saveBtn = form.querySelector('button')
    // console.log('saveBtn', saveBtn)

    saveBtn.addEventListener('click', (e) => {
        // console.log('saveBtn clicked!')
        const formData = new FormData(form);
        const fullName = formData.get('fullName')
        const email = formData.get('studentEmail')
        const password = formData.get('studentPassword')
        const id = formData.get('studentId')
        console.log(fullName)

        const studentInfo = {
            fullName,
            email,
            password,
            id
        }
        
        updateInfo(studentInfo)
    })
}

const updateInfo = (info) => {
    console.log('info', info)
    const data = {
        "details": {
            "id":100117967,
            typeKey : {
                "name": info.fullName,
                "email": info.email,
                "password": info.password,
            }
        }
    }
    fetch(`https://apitest.boomconcole.com/api/concepts/update`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: data,
    })
        .then(res => res.json())
        .then(data => {
            console.log('updated', data)
        })
}