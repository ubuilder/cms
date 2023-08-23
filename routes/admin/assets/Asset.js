import {
  Button,
  Card,
  CardBody,
  Col,
  Modal,
  ButtonGroup,
  Row,
  View,
  CardFooter,
  Input,
  Icon,
} from "@ulibs/ui";

function AssetImage({ asset, mode }) {
  if (mode === "list") {
    return View({
      tag: "img",
      src: asset.url,
      alt: asset.alt,
      style: "object-fit: cover",
      width: "100%",
    });
  }

  return View({
    tag: "img",
    style: "width: 100%; height: auto; max-height: 100%;",
    src: asset.url,
    alt: asset.alt,
    loading: "lazy",
  });
}

function AssetAudio({ asset, mode }) {
  if (mode === "list") {
    return View({ tag: "audio", width: "500px", controls: true }, [
      View({ tag: "source", src: asset.url }),
      View("View"),
    ]);
  }

  return View(
    {
      tag: "div",
      style:
        "display: flex;flex-direction: column;justify-content: space-beetween; width: 100%; height: 100%",
    },
    [
      Icon({ name: "music", size: "xl", p: "md" }),
      View(
        {
          style: "text-align: center;background: rgba(10,10,10,0.3); ",
        },
        asset.name
      ),
    ]
  );
}

function AssetVideo({ asset, mode }) {
  if (mode === "list") {
    return View({ tag: "video", width: "500px", controls: true }, [
      View({ tag: "source", src: asset.url }),
      View("View"),
    ]);
  }

  return View([
    View({
      tag: "video",
      style: "width: auto; height: auto; max-height: 100%;",
      src: asset.url,
    }),
    Icon({
      name: "video",
      size: "xl",
      style:
        "position: absolute; top: 50%; left: 50%; transform: translate(-50%, -80%)",
    }),
    View(
      {
        style:
          "padding-bottom: 3px;background: rgba(10,10,10,0.3);width: 100% ;position: absolute; bottom: 0px ;left: 50%; transform: translate(-50% , 0% ) ",
      },
      asset.name
    ),
  ]);
}

const AssetTypes = {
  image: AssetImage,
  audio: AssetAudio,
  video: AssetVideo,
};

export function AssetModal({ asset }) {
  return Modal(
    {
      size: "md",
      name: `asset-${asset.id}`,
      //   $data: {
      // view: "",
      //   },
      //   $effect: `openModal && $post(window.location.origin+ '/admin/assets?getAsset', {id: '${id}' }).then(res => view =res.view )`,
      style: "z-index: 10",
    },
    [
      Card([
        CardBody({ p: 0, style: "max-height: 80%; overflow: auto" }, [
          Row({ gutter: "xl", m: 0 }, [
            // preview
            Col({ col: 12, colSm: 8 }, [
              AssetTypes[asset.type]({ asset, mode: "preview" }),
            ]),
            //properties
            Col({ p: "sm", col: 12, colSm: 4, $data: asset }, [
              Object.entries(asset).map((prop) => {
                if (prop[0] == "id") return "";
                return Row({ align: "center" }, [
                  Col({ col: 4 }, [
                    View(prop[0].slice(0, 1).toUpperCase() + prop[0].slice(1)),
                  ]),
                  Col({ col: 8 }, [
                    Input({
                      readonly: prop[0] === "url",
                      name: `asset.${prop[0]}`,
                    }),
                  ]),
                ]);
              }),
              Row({
                d: "flex",
                mt: "sm",
                p: "xxs",
                style: "justify-content: end",
              }),
            ]),
          ]),
        ]),
        CardFooter([
          ButtonGroup({ ms: "auto" }, [
            //control buttons
            Button({ onClick: "$modal.close()" }, "Close"),
            Button(
              {
                color: "primary",
                onClick: `$post('?update', asset).then(res=> reload())`,
              },
              "Update"
            ),
          ]),
        ]),
      ]),
    ]
  );
}

function AssetRemoveModal({ asset }) {
  return Modal({ name: "asset-remove-" + asset.id }, [
    Card({ title: "Remove Asset?" }, [
      CardBody(`Are you sure to remove ${asset.name}?`),
      CardFooter([
        ButtonGroup({ ms: "auto" }, [
          Button({ onClick: `$modal.close()` }, "Cancel"),
          Button(
            {
              onClick: `$post('?remove', {id: '${asset.id}'}).then(res => $page.reload())`,
              color: "error",
            },
            "Remove"
          ),
        ]),
      ]),
    ]),
  ]);
}

export function Asset({ asset }) {
  return Col({ col: 12, colXs: 6, colSm: 4, colLg: 3 }, [
    View(
      {
        style: "overflow: hidden",
        bgColor: "base-200",
        $data: { asset },
        border: true,
        borderColor: "base-400",
        borderRadius: "xs",
        onClick: `$modal.open('asset-${asset.id}')`,
      },
      [
        View(
          {
            d: "flex",
            flexDirection: "column",

            style: "cursor: pointer; overflow: hidden; position: relative",
          },
          [
            View(
              { style: "height: 200px; " },
              AssetTypes[asset.type]({ asset, mode: "list" })
            ),
            View(
              {
                textColor: "light-200",
                style:
                  "background: linear-gradient(0, #202020, transparent); position: absolute; bottom: 0; left: 0; right: 0",
                align: "end",
                p: "sm",
                h: "6xl",
                ps: "sm",
                d: "flex",
                justify: "between",
              },
              [
                View(asset.name),
                Icon({
                  p: "xs",
                  onClick: `$event.stopPropagation(); $modal.open('asset-remove-${asset.id}')`,
                  name: "trash",
                }),
              ]
            ),
          ]
        ),
        AssetModal({ asset }),
        AssetRemoveModal({ asset }),
      ]
    ),
  ]);
}
