import { ButtonGroup } from "@ulibs/ui";

export function DataEditor(props, slots) {

    // Modal page, schema (use all form elements)
    return View({$data: {name: '', type: ''}}, [
        Input({name: 'name', label: 'Name'}),
        Select({name: 'type', items: ['a', 'b', 'c'], label: 'Type'}),
        Col([
            ButtonGroup({justify: 'end'}, [
                Button({color: 'info'}, "Add Translation"),
                Button({color: 'primary'}, "Submit")
            ])
        ])
    ])
}