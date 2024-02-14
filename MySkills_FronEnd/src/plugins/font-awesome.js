/* import the fontawesome core */
import { library } from '@fortawesome/fontawesome-svg-core'

/* import font awesome icon component */
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

import {
  faHome,
  faUser,
  faUserPlus,
  faSignInAlt,
  faSignOutAlt,
  faCamera,
  faStar,
  faBook,
  faMagnifyingGlass,
  faTimes,
  faUndo,
  faGears,
  faPencil,
  faTrash
} from "@fortawesome/free-solid-svg-icons";

/* add icons to the library */
library.add(
  faHome,
  faUser,
  faUserPlus,
  faSignInAlt,
  faSignOutAlt,
  faCamera,
  faStar,
  faBook,
  faMagnifyingGlass,
  faTimes,
  faUndo,
  faGears,
  faPencil,
  faTrash
);

export { FontAwesomeIcon };