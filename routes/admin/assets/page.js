import {
  View,
  Button,
  Dropdown,
  DropdownPanel,
  DropdownItem,
  Col,
  Row,
  Icon,
  Tooltip,
  CardBody,
  Modal,
  Card,
  ModalBody,
  Input,
} from "@ulibs/ui";
import { runAction } from "../../../utils/ui.js";
//all the frontend conponent for this page
import { OffCanvas } from "./views.js";

//actions
export * from './actions.js'

export default function () {
  return OffCanvas();
}
