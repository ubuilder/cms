window.addEventListener("alpine:init", (e) => {
  console.log("register page data");

  const page = Alpine.data("page", (current_id) => {
    return {
      clipboard: {},
      component: {},
      placement: "",
      position: "",
      parent_id: "",
      contextmenuOpen: false,
      x: 0,
      y: 0,
      id: "",
      onKeydown($event) {
        if ($event.code === "Space") {
          this.$modal.open("component-" + this.id + "-settings");
        } else if ($event.code === "Escape") {
          this.id = "";
        }
      },
      clearSelection() {
        this.id = ""; 
        this.contextmenuOpen = false;
      },
      openContextMenu($event, id) {
        $event.preventDefault();
        $event.stopPropagation();

        this.id = id;
        this.contextmenuOpen = true;
        this.x = $event.clientX;
        this.y = $event.clientY;
      },
      onCutInstance(instance_id, component_id) {
        document.querySelector(`#item-${instance_id}`).classList.add("cut");
        this.clipboard = {
          instance_id,
          mode: "cut",
          component_id,
        };
      },
      onCopyInstance(instance_id, component_id) {
        document.querySelector(`#item-${instance_id}`).classList.add("copy");
        this.clipboard = {
          mode: "copy",
          component_id,
          instance_id,
          // props,
        };
      },
      onCreateComponent({instance_id, parent_id, name}) {
        this.$post("/editor?create_component", {instance_id, parent_id, name}).then(res => this.$page.reload())
      },
      openCreateComponentModal(instance_id, parent_id) {
        this.parent_id = parent_id ?? "";
        this.$modal.open(`create-component-${instance_id}`);
      },
      openInsertModal(instance_id, parent_id, placement) {
        this.parent_id = parent_id;
        this.position = instance_id;
        this.placement = placement;

        this.$modal.open("add-component");
      },
      onAddInstance({
        component_id,
        instance_id,
        props = {},
        placement,
        position,
        parent_id,
      }) {

        console.log(this.parent_id)
        
        return this.$post("/editor?add_instance", {
          component_id,
          instance_id,
          props,
          placement: placement || this.placement,
          position: position || this.position,
          parent_id: parent_id || this.parent_id || current_id,
        }).then(res => this.$page.reload());
      },
      onRemoveInstance({ instance_id }) {
        return this.$post("/editor?remove_instance", { instance_id });
      },
      onUpdateInstance({instance_id, props}) {
        return this.$post("/editor?update_instance", { instance_id, props });
      },
      onComponentItemSelected({ component }) {
        this.$modal.close();

        if (component.props.length > 0) {
          this.$modal.open("add-component-" + component.id + "-settings");
        } else {
          return this.onAddInstance({ component_id: component.id, props: [] })
        }
      },
      openComponentModal(id) {
        const component = JSON.parse(document.querySelector('script[type="text/json"]#component-' + id).textContent)

        this.component = component;
        this.$modal.close()
        // console.log('should open edit component modal', component)
        this.$modal.open('component-edit-modal')
      },
      closeComponentModal() {
        this.$modal.close()
        this.$page.reload()
      },
      onClickPlaceholder($event, instance_id) {
        $event.stopPropagation();
        this.contextmenuOpen = false;
        this.position = ''
        this.parent_id = instance_id

        this.$modal.open('add-component')
      }
    };
  });

  Alpine.data("componentSettings", (id) => {
    const props = JSON.parse(document.querySelector('script[type="text/json"]#prop-' + id).textContent)

    return {
      props,
      toggleType(index) {
        this.props[index].value.type = this.isStatic(index)
          ? "dynamic"
          : "static";
      },
      isStatic(index) {
        return this.props[index].value.type === "static";
      },
    };
  });


});
