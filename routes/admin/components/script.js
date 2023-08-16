// frontend code
document.addEventListener('alpine:init', (e) => {

    console.log(window.Alpine)

    Alpine.data('page', () => {
        return {
            component: {},

            openEditComponentModal(component) {
                this.$modal.close();
                this.component = component
                this.$modal.open('component-edit-modal')

            }
        }
    })
    

}) 