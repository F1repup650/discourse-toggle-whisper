import { withPluginApi } from "discourse/lib/plugin-api";
import { ajax } from "discourse/lib/ajax";
import { popupAjaxError } from "discourse/lib/ajax-error";

export default {
  name: "toggle-action",
  initialize() {
    withPluginApi("0.11.0", actionInit);
  },
};

const actionInit = (api) => {
  const currentUser = api.getCurrentUser();
  if (currentUser && currentUser.staff) {
    api.attachWidgetAction("post-menu", "toggleAction", function () {
      const model = this.attrs;
      let newType = model.post_type === 1 ? 3 : 1;

      ajax(`/posts/${model.id}/post_type`, {
        type: "PUT",
        data: {
          post_type: newType,
        },
      }).catch(popupAjaxError);
    });

    api.addPostMenuButton("toggleAction", (model) => {
      if (model.post_number < 2) return;

      let isAction = model.post_type === 3;
      let icon = isAction ? "star" : "far-star";
      let title = isAction
        ? "toggle_button_title.regular"
        : "toggle_button_title.action";
      return {
        action: "toggleAction",
        icon: icon,
        title: themePrefix(title),
        position: "second-last-hidden",
      };
    });
  }
};
