// routine.js
document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('routineModal');
    const addRoutineBtn = document.getElementById('addRoutineBtn');
    const closeBtn = document.querySelector('.close');
    const cancelBtn = document.querySelector('.modal-cancel-btn');

    addRoutineBtn.onclick = () => {
        modal.style.display = 'block';
    }

    closeBtn.onclick = () => {
        modal.style.display = 'none';
    }

    cancelBtn.onclick = () => {
        modal.style.display = 'none';
    }

    window.onclick = (event) => {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    }
});
