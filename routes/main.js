import {
  Accordion,
  AccordionBody,
  AccordionHeader,
  Accordions,
  Badge,
  Button,
  ButtonGroup,
  Card,
  Col,
  Form,
  FormField,
  Input,
  Row,
  Select,
  Switch,
  View,
} from "@ulibs/ui";
import { AdminLayout } from "./main.view.js";
import path from "path";

export default function main(ctx) {
  ctx.addStatic({
    path: path.resolve("./node_modules/@ulibs/ui/dist"),
    prefix: "/dist",
  });

  ctx.addLayout("/", {
    load() {
      return {
        user: {
          name: "hadi",
          username: "hadiahmadi",
          email: "thehadiahmadi@gmail.com",
        },
      };
    },
    component: AdminLayout,
  });

  ctx.addPage("/", {
    load() {
      return {
        messages: [
          {
            type: "info",
            dismissible: true,
            content: "Welcome to UBuilder CMS",
            title: "Welcome!",
          },
        ],
      };
    },
    page: "Dashboard",
  });

  function FieldItemEditor({name}) {
    return ;
  }


  ctx.addPage("/data/field-ui", {
    page() {
      return View({py: 'md'}, [
        FormField({ $data: {fields: []}, label: "Columns" }, [
          Card( [
            Accordions([
              For({items: 'fields', as: 'field'}, [
                FieldItemEditor({name: 'field'}),
              ])
            ]),
          ]),
          View({$text: 'fields'}),
          Button({onClick: "fields.push({name: 'new'})", mt: 'sm'}, "Add Field")
        ]),
      ]);
    },
  });
}
