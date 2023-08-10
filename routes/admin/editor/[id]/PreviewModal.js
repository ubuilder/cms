import {
  Button,
  ButtonGroup,
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  Icon,
  Modal,
  View,
} from "@ulibs/ui";
import { closeModal, openModal } from "../../../../utils/ui.js";

export function openPreviewModal() {
  return openModal("preview-modal");
}

export function PreviewModal({ title, slug }) {
  return Modal({ name: "preview-modal", size: "lg" }, [
    Card({}, [
      CardHeader([
        CardTitle(title),
        ButtonGroup([
          Button({ href: slug, target: "_blank" }, [
            Icon({ name: "external-link" }),
            "Open in new tab",
          ]),
          Button({ onClick: closeModal() }, "Close"),
        ]),
      ]),
      CardBody({ style: "max-height: 80%; overflow: auto", p: 0 }, [
        View({
          tag: "iframe",
          src: "/" + slug,
          border: true,
          borderColor: "base-400",
          w: 100,
          h: 100,
        }),
      ]),
    ]),
  ]);
}
