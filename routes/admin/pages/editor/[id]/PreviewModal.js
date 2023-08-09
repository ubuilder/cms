import { Button, ButtonGroup, Card, CardBody, CardHeader, CardTitle, Icon, Modal, View } from "@ulibs/ui";
import { closeModal } from "../../../../../utils/ui.js";

export function PreviewModal(page) {
    return Modal({ name: "preview-modal", size: "lg" }, [
      Card({}, [
        CardHeader([
          CardTitle(page.title),
          ButtonGroup([
            Button({ href: "/preview/" + page.id, target: "_blank" }, [
              Icon({ name: "external-link" }),
              "Open in new tab",
            ]),
            Button({ onClick: closeModal() }, "Close"),
          ]),
        ]),
        CardBody({ style: "max-height: 80%; overflow: auto", p: 0 }, [
          View({
            tag: "iframe",
            src: `/preview/${page.id}`,
            border: true,
            borderColor: "base-400",
            w: 100,
            h: 100,
          }),
        ]),
      ]),
    ]);
  }
  