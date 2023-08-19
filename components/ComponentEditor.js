import { Button, Card, CardHeader, Modal, View } from "@ulibs/ui";

export function EditComponentModal({page_id} = {}) {
    return Modal({persistent: true, name: 'component-edit-modal', size: 'md'}, [
      Card({style: 'height: 80%'}, [
        CardHeader([
          View({$text: 'component.name'}),
          Button({onClick: '$modal.close()'}, "Close")
        ]),
        View({tag: 'iframe', w: 100, h: 100, style: 'border: none', $src: `(component?.slot_id ? '/editor/' + component.slot_id : '---') + '?page_id=${page_id}'`})
      ]),
    ])
  }