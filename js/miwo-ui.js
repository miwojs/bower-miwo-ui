(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var BehaviorManager, CheckSelector, DefaultRenderer, DialogFactory, DropdownManager, FormRendererFactory, InlineRenderer, LoadingMask, LoadingMaskFactory, MiwoUiExtension, Notificator, PickerManager, PopoverBehavior, PopoverManager, RowSelector, SelectorFactory, TabsBehavior, TooltipBehavior, TooltipManager, WindowManager,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

DialogFactory = require('./window/DialogFactory');

WindowManager = require('./window/WindowManager');

FormRendererFactory = require('./form/render/FormRendererFactory');

DefaultRenderer = require('./form/render/DefaultRenderer');

InlineRenderer = require('./form/render/InlineRenderer');

TooltipManager = require('./tip/TooltipManager');

PopoverManager = require('./tip/PopoverManager');

BehaviorManager = require('./behaviors/BehaviorManager');

TooltipBehavior = require('./behaviors/Tooltip');

PopoverBehavior = require('./behaviors/Popover');

TabsBehavior = require('./behaviors/Tabs');

SelectorFactory = require('./selection/SelectorFactory');

CheckSelector = require('./selection/CheckSelector');

RowSelector = require('./selection/RowSelector');

Notificator = require('./notify/Notificator');

LoadingMaskFactory = require('./mask/LoadingMaskFactory');

LoadingMask = require('./mask/LoadingMask');

PickerManager = require('./picker/PickerManager');

DropdownManager = require('./dropdown/DropdownManager');

MiwoUiExtension = (function(_super) {
  __extends(MiwoUiExtension, _super);

  function MiwoUiExtension() {
    return MiwoUiExtension.__super__.constructor.apply(this, arguments);
  }

  MiwoUiExtension.prototype.init = function() {
    this.setConfig({
      behaviors: {
        tooltip: TooltipBehavior,
        popover: PopoverBehavior,
        tabs: TabsBehavior
      },
      selectors: {
        row: RowSelector,
        check: CheckSelector
      },
      mask: {
        instanceCls: LoadingMask
      }
    });
  };

  MiwoUiExtension.prototype.build = function(injector) {
    injector.define('dialogFactory', DialogFactory).setGlobal('dialog');
    injector.define('windowMgr', WindowManager).setGlobal();
    injector.define('formRendererFactory', FormRendererFactory, (function(_this) {
      return function(service) {
        service.register('default', DefaultRenderer);
        service.register('inline', InlineRenderer);
      };
    })(this));
    injector.define('dropdownMgr', DropdownManager).setGlobal();
    injector.define('tooltip', TooltipManager).setGlobal();
    injector.define('popover', PopoverManager).setGlobal();
    injector.define('behavior', BehaviorManager).setGlobal().setup((function(_this) {
      return function(service) {
        var name, value, _ref;
        _ref = _this.config.behaviors;
        for (name in _ref) {
          value = _ref[name];
          if (Type.isFunction(value)) {
            service.install(name, injector.createInstance(value));
          } else {
            throw new Error("Behavior must be function (constructor).");
          }
        }
      };
    })(this));
    injector.define('selectorFactory', SelectorFactory, (function(_this) {
      return function(service) {
        var klass, name, _ref;
        _ref = _this.config.selectors;
        for (name in _ref) {
          klass = _ref[name];
          service.register(name, klass);
        }
      };
    })(this));
    injector.define('notificator', Notificator).setGlobal();
    injector.define('mask', LoadingMaskFactory).setGlobal().setup((function(_this) {
      return function(service) {
        service.instanceCls = _this.config.mask.instanceCls;
      };
    })(this));
    injector.define('pickers', PickerManager).setGlobal();
  };

  MiwoUiExtension.prototype.update = function(injector) {
    injector.update('componentMgr').setup((function(_this) {
      return function(service) {
        var behavior;
        behavior = injector.get('behavior');
        service.on('afterrender', function(component) {
          behavior.apply(component.el);
        });
      };
    })(this));
  };

  return MiwoUiExtension;

})(Miwo.di.InjectorExtension);

module.exports = MiwoUiExtension;


},{"./behaviors/BehaviorManager":2,"./behaviors/Popover":3,"./behaviors/Tabs":4,"./behaviors/Tooltip":5,"./dropdown/DropdownManager":16,"./form/render/DefaultRenderer":47,"./form/render/FormRendererFactory":48,"./form/render/InlineRenderer":49,"./mask/LoadingMask":84,"./mask/LoadingMaskFactory":85,"./notify/Notificator":90,"./picker/PickerManager":104,"./selection/CheckSelector":113,"./selection/RowSelector":114,"./selection/SelectorFactory":116,"./tip/PopoverManager":124,"./tip/TooltipManager":126,"./window/DialogFactory":134,"./window/WindowManager":137}],2:[function(require,module,exports){
var BehaviorManager;

BehaviorManager = (function() {
  BehaviorManager.prototype.behaviors = null;

  function BehaviorManager() {
    this.behaviors = {};
  }

  BehaviorManager.prototype.install = function(name, plugin) {
    this.behaviors[name] = plugin;
    this[name] = plugin;
    miwo.ready((function(_this) {
      return function() {
        if (plugin.init) {
          plugin.init(miwo.body);
        }
      };
    })(this));
  };

  BehaviorManager.prototype.get = function(name) {
    return this.behaviors[name];
  };

  BehaviorManager.prototype.apply = function(element) {
    var behavior, name, _ref;
    _ref = this.behaviors;
    for (name in _ref) {
      behavior = _ref[name];
      if (behavior.apply) {
        behavior.apply(element);
      }
    }
  };

  return BehaviorManager;

})();

module.exports = BehaviorManager;


},{}],3:[function(require,module,exports){
var Popover,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Popover = (function(_super) {
  __extends(Popover, _super);

  function Popover() {
    return Popover.__super__.constructor.apply(this, arguments);
  }

  Popover.prototype.selector = '[data-toggle="popover"]';

  Popover.prototype.popover = Popover.inject('popover');

  Popover.prototype.init = function(body) {
    body.on("mouseenter:relay(" + this.selector + ")", (function(_this) {
      return function(e, target) {
        _this.popover.show(target);
      };
    })(this));
  };

  return Popover;

})(Miwo.Object);

module.exports = Popover;


},{}],4:[function(require,module,exports){
var Tabs,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Tabs = (function(_super) {
  __extends(Tabs, _super);

  function Tabs() {
    return Tabs.__super__.constructor.apply(this, arguments);
  }

  Tabs.prototype.selector = '[data-toggle="tab"]';

  Tabs.prototype.init = function(body) {};

  return Tabs;

})(Miwo.Object);

module.exports = Tabs;


},{}],5:[function(require,module,exports){
var Tooltip,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Tooltip = (function(_super) {
  __extends(Tooltip, _super);

  function Tooltip() {
    return Tooltip.__super__.constructor.apply(this, arguments);
  }

  Tooltip.prototype.selector = '[data-toggle="tooltip"]';

  Tooltip.prototype.tooltip = Tooltip.inject('tooltip');

  Tooltip.prototype.init = function(body) {
    body.on("mouseenter:relay(" + this.selector + ")", (function(_this) {
      return function(e, target) {
        _this.tooltip.show(target);
      };
    })(this));
  };

  return Tooltip;

})(Miwo.Object);

module.exports = Tooltip;


},{}],6:[function(require,module,exports){
var Button,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Button = (function(_super) {
  __extends(Button, _super);

  function Button() {
    return Button.__super__.constructor.apply(this, arguments);
  }

  Button.defaultIconClsPrefix = 'glyphicon-';

  Button.defaultIconClsBase = 'glyphicon';

  Button.prototype.isButton = true;

  Button.prototype.xtype = "button";

  Button.prototype.el = 'button';

  Button.prototype.baseCls = 'btn';

  Button.prototype.handler = null;

  Button.prototype.text = '';

  Button.prototype.size = '';

  Button.prototype.type = 'default';

  Button.prototype.disabled = false;

  Button.prototype.active = false;

  Button.prototype.toggled = false;

  Button.prototype.toggleHandler = null;

  Button.prototype.tooltip = null;

  Button.prototype.title = null;

  Button.prototype.icon = null;

  Button.prototype.textEl = null;

  Button.prototype.iconEl = null;

  Button.prototype.setDisabled = function(disabled, silent) {
    this.el.toggleClass('disabled', disabled);
    this.el.set('tabindex', -disabled);
    this.disabled = disabled;
    if (!silent) {
      if (disabled) {
        this.emit('disabled', this);
      } else {
        this.emit('enabled', this);
      }
    }
  };

  Button.prototype.setText = function(text) {
    this.text = text;
    if (this.textEl) {
      this.textEl.set("html", (this.icon ? ' ' + this.text : this.text));
    }
  };

  Button.prototype.setIcon = function(cls, silent) {
    if (this.iconEl && this.icon) {
      this.iconEl.removeClass(Button.defaultIconClsPrefix + this.icon);
    }
    this.icon = cls;
    if (this.iconEl) {
      if (cls) {
        this.iconEl.addClass(Button.defaultIconClsPrefix + cls);
        this.iconEl.show("inline-block");
      } else {
        this.iconEl.hide();
      }
    }
  };

  Button.prototype.setSize = function(size) {
    if (this.size) {
      this.el.removeClass(this.getBaseCls(this.size));
    }
    if (size) {
      this.el.addClass(this.getBaseCls(size));
    }
    this.size = size;
  };

  Button.prototype.setType = function(type) {
    if (this.type) {
      this.el.removeClass(this.getBaseCls(this.type));
    }
    if (type) {
      this.el.addClass(this.getBaseCls(type));
    }
    this.type = type;
  };

  Button.prototype.setActive = function(active, silent) {
    this.el.toggleClass('active', active);
    this.active = active;
    if (!silent && active) {
      this.emit('active', this, active);
    }
  };

  Button.prototype.isActive = function() {
    return this.active && !this.disabled;
  };

  Button.prototype.setToggled = function(toggled) {
    this.toggled = toggled;
  };

  Button.prototype.toggle = function(silent) {
    this.setActive(!this.active);
    if (!silent) {
      this.emit('toggle', this, this.active);
      if (this.toggleHandler) {
        this.toggleHandler(this, this.active);
      }
    }
  };

  Button.prototype.click = function(e) {
    if (Type.isFunction(this.handler)) {
      this.handler(this, e);
    } else if (Type.isString(this.handler)) {
      if (this.handler.indexOf('#') === 0) {
        miwo.redirect(this.handler);
      } else {
        document.location = this.handler;
      }
    }
  };

  Button.prototype.doRender = function() {
    if (this.type) {
      this.el.addClass(this.getBaseCls(this.type));
    }
    if (this.size) {
      this.el.addClass(this.getBaseCls(this.size));
    }
    if (this.active) {
      this.el.addClass('active');
    }
    if (this.disabled) {
      this.el.addClass('disabled');
    }
    if (this.disabled) {
      this.el.set('tabindex', -1);
    }
    if (this.tooltip || this.title) {
      this.el.set("title", this.tooltip || this.title);
    }
    this.el.on("click", this.bound("onClick"));
    this.el.on("keyup", this.bound("onKeyup"));
    this.iconEl = new Element("i", {
      parent: this.el,
      cls: Button.defaultIconClsBase
    });
    this.textEl = new Element("span", {
      parent: this.el,
      html: (this.icon ? ' ' + this.text : this.text)
    });
    this.iconEl.addClass(Button.defaultIconClsPrefix + this.icon);
    if (!this.icon) {
      this.iconEl.hide();
    }
  };

  Button.prototype.onClick = function(e) {
    e.stop();
    if (this.disabled) {
      return;
    }
    this.preventClick = false;
    this.emit('beforeclick', this, e);
    if (this.preventClick) {
      return;
    }
    if (this.toggled) {
      this.toggle();
    }
    this.emit('click', this, e);
    this.click(e);
  };

  Button.prototype.onKeyup = function(e) {
    if (e.key === 'enter') {
      this.onClick(e);
    }
  };

  return Button;

})(Miwo.Component);

module.exports = Button;


},{}],7:[function(require,module,exports){
var Button, ButtonGroup, DropdownButton,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Button = require('./Button');

DropdownButton = require('./DropdownButton');

ButtonGroup = (function(_super) {
  __extends(ButtonGroup, _super);

  function ButtonGroup() {
    return ButtonGroup.__super__.constructor.apply(this, arguments);
  }

  ButtonGroup.prototype.xtype = "buttongroup";

  ButtonGroup.prototype.toggle = null;

  ButtonGroup.prototype.size = null;

  ButtonGroup.prototype.label = null;

  ButtonGroup.prototype.role = 'group';

  ButtonGroup.prototype.layout = 'auto';

  ButtonGroup.prototype.baseCls = 'btn-group';

  ButtonGroup.prototype.validateChildComponent = function(component) {
    if (!component.isButton) {
      throw new Error("Child component must by instance of Miwo.button.Button");
    }
  };

  ButtonGroup.prototype.addedComponent = function(component) {
    component.setToggled(!!this.toggle);
    this.mon(component, "active", "onButtonActive");
  };

  ButtonGroup.prototype.removedComponent = function(component) {
    this.mun(component);
  };

  ButtonGroup.prototype.onButtonActive = function(btn) {
    if (this.toggle === "radio") {
      this.getActiveButtons().each(function(pbtn) {
        if (pbtn !== btn) {
          pbtn.setActive(false, true);
        }
      });
    }
    this.emit('active', this, btn);
  };

  ButtonGroup.prototype.setDisabled = function(disabled, silent) {
    this.getComponents().each(function(component) {
      component.setDisabled(disabled, silent);
    });
  };

  ButtonGroup.prototype.setActive = function(name, active, silent) {
    this.get(name).setActive(active, silent);
  };

  ButtonGroup.prototype.setActiveAll = function(active) {
    this.getComponents().each(function(component) {
      component.setActive(active, true);
    });
  };

  ButtonGroup.prototype.getActiveButtons = function() {
    var active;
    active = [];
    this.getComponents().each(function(component) {
      if (component.isActive()) {
        active.push(component);
      }
    });
    return active;
  };

  ButtonGroup.prototype.getActiveButton = function() {
    var active;
    active = null;
    this.getComponents().each(function(component) {
      if (component.isActive()) {
        active = component;
        return false;
      }
    });
    return active;
  };

  ButtonGroup.prototype.addButton = function(name, config) {
    return this.add(name, new Button(config));
  };

  ButtonGroup.prototype.addDropdownButton = function(name, config) {
    return this.add(name, new DropdownButton(config));
  };

  ButtonGroup.prototype.afterRender = function() {
    ButtonGroup.__super__.afterRender.apply(this, arguments);
    if (this.label) {
      this.el.set('aria-label', this.label);
    }
    if (this.size) {
      this.el.addClass('btn-group-' + this.size);
    }
  };

  return ButtonGroup;

})(Miwo.Container);

module.exports = ButtonGroup;


},{"./Button":6,"./DropdownButton":9}],8:[function(require,module,exports){
var Button, CloseButton,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Button = require('./Button');

CloseButton = (function(_super) {
  __extends(CloseButton, _super);

  function CloseButton() {
    return CloseButton.__super__.constructor.apply(this, arguments);
  }

  CloseButton.prototype.baseCls = 'close';

  CloseButton.prototype.text = '<span aria-hidden="true">×</span>';

  return CloseButton;

})(Button);

module.exports = CloseButton;


},{"./Button":6}],9:[function(require,module,exports){
var Button, DropdownButton, DropdownList,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Button = require('./Button');

DropdownList = require('../dropdown/List');

DropdownButton = (function(_super) {
  __extends(DropdownButton, _super);

  function DropdownButton() {
    return DropdownButton.__super__.constructor.apply(this, arguments);
  }

  DropdownButton.prototype.dropdown = null;

  DropdownButton.prototype.afterRender = function() {
    DropdownButton.__super__.afterRender.apply(this, arguments);
    this.el.set('aria-haspopup', true);
    this.el.set('aria-expanded', false);
  };

  DropdownButton.prototype.getDropdown = function() {
    if (!this.dropdown) {
      this.dropdown = new DropdownList({
        target: this.el
      });
      this.dropdown.el.set('aria-labelledby', this.id);
    }
    return this.dropdown;
  };

  DropdownButton.prototype.doRender = function() {
    var caret;
    DropdownButton.__super__.doRender.apply(this, arguments);
    caret = new Element('span', {
      cls: 'caret'
    });
    caret.inject(this.getContentEl());
  };

  DropdownButton.prototype.click = function() {
    this.getDropdown().toggle();
  };

  DropdownButton.prototype.doDestroy = function() {
    if (this.dropdown) {
      this.dropdown.destroy();
    }
    return DropdownButton.__super__.doDestroy.apply(this, arguments);
  };

  return DropdownButton;

})(Button);

module.exports = DropdownButton;


},{"../dropdown/List":18,"./Button":6}],10:[function(require,module,exports){
var Button, ToolButton,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Button = require('./Button');

ToolButton = (function(_super) {
  __extends(ToolButton, _super);

  function ToolButton() {
    return ToolButton.__super__.constructor.apply(this, arguments);
  }

  ToolButton.prototype.isTool = true;

  ToolButton.prototype.xtype = "toolbutton";

  ToolButton.prototype.handler = null;

  ToolButton.prototype.icon = null;

  ToolButton.prototype.text = "";

  ToolButton.prototype.tooltip = null;

  ToolButton.prototype.el = 'button';

  ToolButton.prototype.textEl = null;

  ToolButton.prototype.iconEl = null;

  ToolButton.prototype.setDisabled = function(disabled, silent) {
    this.el.toggleClass('disabled', disabled);
    this.disabled = disabled;
    if (!silent) {
      if (disabled) {
        this.emit('disabled', this);
      } else {
        this.emit('enabled', this);
      }
    }
  };

  ToolButton.prototype.setText = function(text) {
    this.text = text;
    if (this.textEl) {
      this.textEl.set("html", text);
    }
  };

  ToolButton.prototype.setIcon = function(cls, silent) {
    if (this.iconEl) {
      if (this.icon) {
        this.iconEl.removeClass(Button.defaultIconClsPrefix + this.icon);
      }
    }
    this.icon = cls;
    if (this.iconEl) {
      if (cls) {
        this.iconEl.addClass(Button.defaultIconClsPrefix + cls);
        this.iconEl.show("inline-block");
      } else {
        this.iconEl.hide();
      }
    }
  };

  ToolButton.prototype.click = function(e) {
    if (this.handler) {
      this.handler(this, e);
    }
  };

  ToolButton.prototype.doRender = function() {
    this.el.addClass('btn-tool');
    if (this.disabled) {
      this.el.addClass('disabled');
    }
    if (this.tooltip) {
      this.el.set("title", this.tooltip);
    }
    this.el.on("click", this.bound("onClick"));
    this.iconEl = new Element("i", {
      parent: this.el,
      cls: Button.defaultIconClsBase + ' ' + Button.defaultIconClsPrefix + this.icon
    });
    this.textEl = new Element("span", {
      parent: this.el,
      cls: 'sr-only',
      html: this.text
    });
  };

  ToolButton.prototype.onClick = function(e) {
    e.stop();
    if (this.disabled) {
      return;
    }
    this.preventClick = false;
    this.emit('beforeclick', this, e);
    if (this.preventClick) {
      return;
    }
    this.emit('click', this, e);
    this.click(e);
  };

  return ToolButton;

})(Miwo.Component);

module.exports = ToolButton;


},{"./Button":6}],11:[function(require,module,exports){
module.exports = {
  ButtonGroup: require('./ButtonGroup'),
  Button: require('./Button'),
  ToolButton: require('./ToolButton'),
  DropdownButton: require('./DropdownButton'),
  CloseButton: require('./CloseButton')
};


},{"./Button":6,"./ButtonGroup":7,"./CloseButton":8,"./DropdownButton":9,"./ToolButton":10}],12:[function(require,module,exports){
var Drag,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

Drag = (function(_super) {
  __extends(Drag, _super);

  Drag.prototype.snap = 6;

  Drag.prototype.unit = 'px';

  Drag.prototype.grid = null;

  Drag.prototype.style = true;

  Drag.prototype.limits = null;

  Drag.prototype.handle = false;

  Drag.prototype.invert = false;

  Drag.prototype.preventDefault = false;

  Drag.prototype.stopPropagation = false;

  Drag.prototype.modifiers = null;

  Drag.prototype.mouse = null;

  Drag.prototype.value = null;

  Drag.prototype.handles = null;

  Drag.prototype.document = null;

  Drag.prototype.element = null;

  function Drag(element, config) {
    var type;
    this.element = element;
    Drag.__super__.constructor.call(this, config);
    this.element = document.id(this.element);
    this.document = this.element.getDocument();
    if (!this.modifiers) {
      this.modifiers = {
        x: 'left',
        y: 'top'
      };
    }
    type = typeOf(this.handle);
    this.handles = (type === 'array' || type === 'collection' ? $$(this.handle) : document.id(this.handle)) || this.element;
    if (!this.limits) {
      this.limits = {
        x: [],
        y: []
      };
    }
    this.mouse = {
      'now': {},
      'pos': {}
    };
    this.value = {
      'start': {},
      'now': {}
    };
    if (__indexOf.call(document, 'ondragstart') >= 0 && !(__indexOf.call(window, 'FileReader') >= 0) && !Drag.ondragstartFixed) {
      document.ondragstart = Function.from(false);
      Drag.ondragstartFixed = true;
    }
    if (this.grid === null || typeOf(this.grid) === 'number') {
      this.grid = {
        x: this.grid,
        y: this.grid
      };
    }
    this.attach();
    return;
  }

  Drag.prototype.attach = function() {
    this.handles.on('mousedown', this.bound('start'));
    return this;
  };

  Drag.prototype.detach = function() {
    this.handles.un('mousedown', this.bound('start'));
    return this;
  };

  Drag.prototype.start = function(event) {
    var coordinates, name, property, style, _ref;
    if (event.rightClick) {
      return;
    }
    if (this.preventDefault) {
      event.preventDefault();
    }
    if (this.stopPropagation) {
      event.stopPropagation();
    }
    this.mouse.start = event.page;
    this.emit('beforestart', this.element);
    _ref = this.modifiers;
    for (name in _ref) {
      property = _ref[name];
      if (!property) {
        continue;
      }
      style = this.element.getStyle(property);
      if (style && !style.match(/px$/)) {
        if (!coordinates) {
          coordinates = this.element.getCoordinates(this.element.getOffsetParent());
        }
        style = coordinates[property];
      }
      if (this.style) {
        this.value.now[name] = (style || 0).toInt();
      } else {
        this.value.now[name] = this.element[property];
      }
      if (this.invert) {
        this.value.now[name] *= -1;
      }
      this.mouse.pos[name] = event.page[name] - this.value.now[name];
    }
    this.document.on('mousemove', this.bound('check'));
    this.document.on('mouseup', this.bound('cancel'));
  };

  Drag.prototype.check = function(event) {
    var distance;
    if (this.preventDefault) {
      event.preventDefault();
    }
    distance = Math.round(Math.sqrt(Math.pow(event.page.x - this.mouse.start.x, 2) + Math.pow(event.page.y - this.mouse.start.y, 2)));
    if (distance > this.snap) {
      this.cancel();
      this.document.on('mousemove', this.bound('drag'));
      this.document.on('mouseup', this.bound('stop'));
      this.emit('start', this.element, event);
      this.emit('snap', this.element);
    }
  };

  Drag.prototype.drag = function(event) {
    var name, property, _ref;
    if (this.preventDefault) {
      event.preventDefault();
    }
    this.mouse.now = event.page;
    _ref = this.modifiers;
    for (name in _ref) {
      property = _ref[name];
      if (!property) {
        continue;
      }
      this.value.now[name] = this.mouse.now[name] - this.mouse.pos[name];
      if (this.invert) {
        this.value.now[name] *= -1;
      }
      if (this.limits[name]) {
        if ((this.limits[name][1] || this.limits[name][1] === 0) && this.value.now[name] > this.limits[name][1]) {
          this.value.now[name] = this.limits[name][1];
        } else if ((this.limits[name][0] || this.limits[name][0] === 0) && this.value.now[name] < this.limits[name][0]) {
          this.value.now[name] = this.limits[name][0];
        }
      }
      if (this.grid && this.grid[name]) {
        this.value.now[name] -= (this.value.now[name] - (this.limits[name][0] || 0)) % this.grid[name];
      }
      if (this.style) {
        this.element.setStyle(property, this.value.now[name] + this.unit);
      } else {
        this.element[property] = this.value.now[name];
      }
    }
    this.emit('drag', this.element, event);
  };

  Drag.prototype.cancel = function(event) {
    this.document.un('mousemove', this.bound('check'));
    this.document.un('mouseup', this.bound('cancel'));
    if (event) {
      this.emit('cancel', this.element);
    }
  };

  Drag.prototype.stop = function(event) {
    this.document.un('mousemove', this.bound('drag'));
    this.document.un('mouseup', this.bound('stop'));
    if (event) {
      this.emit('complete', this.element, event);
    }
  };

  return Drag;

})(Miwo.Object);

module.exports = Drag;


},{}],13:[function(require,module,exports){
var Drag, Slider,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Drag = require('./Drag');

Slider = (function(_super) {
  __extends(Slider, _super);

  Slider.prototype.initialStep = 0;

  Slider.prototype.snap = false;

  Slider.prototype.offset = 0;

  Slider.prototype.range = false;

  Slider.prototype.wheel = false;

  Slider.prototype.steps = 100;

  Slider.prototype.mode = 'horizontal';

  Slider.prototype.axis = null;

  Slider.prototype.property = null;

  Slider.prototype.offsetProperty = null;

  Slider.prototype.full = 0;

  function Slider(element, knob, config) {
    var limits, modifiers;
    Slider.__super__.constructor.call(this, config);
    this.element = document.id(element);
    this.knob = document.id(knob);
    this.step = this.initialStep ? this.initialStep : (this.range ? this.range[0] : 0);
    this.previousChange = this.previousEnd = this.step;
    switch (this.mode) {
      case 'vertical':
        this.axis = 'y';
        this.property = 'top';
        this.offsetProperty = 'offsetHeight';
        limits = {
          x: [0, 0],
          y: []
        };
        modifiers = {
          x: false,
          y: 'top'
        };
        break;
      case 'horizontal':
        this.axis = 'x';
        this.property = 'left';
        this.offsetProperty = 'offsetWidth';
        limits = {
          x: [],
          y: [0, 0]
        };
        modifiers = {
          x: 'left',
          y: false
        };
    }
    this.drag = new Drag(this.knob, {
      snap: 0,
      limits: limits,
      modifiers: modifiers
    });
    this.drag.on('drag', (function(_this) {
      return function() {
        _this.draggedKnob();
      };
    })(this));
    this.drag.on('start', (function(_this) {
      return function() {
        _this.draggedKnob();
      };
    })(this));
    this.drag.on('beforestart', (function(_this) {
      return function() {
        _this.isDragging = true;
      };
    })(this));
    this.drag.on('cancel', (function(_this) {
      return function() {
        _this.isDragging = false;
      };
    })(this));
    this.drag.on('complete', (function(_this) {
      return function() {
        _this.isDragging = false;
        _this.draggedKnob();
        _this.end();
      };
    })(this));
    this.knob.setStyle(this.property, -this.offset);
    this.setSliderDimensions();
    this.setRange(this.range, null, true);
    if (this.snap) {
      this.setSnap();
    }
    if (this.initialStep !== null) {
      this.setStep(this.initialStep, true);
    }
    this.attach();
    return;
  }

  Slider.prototype.onTick = function(position) {
    this.setKnobPosition(position);
  };

  Slider.prototype.attach = function() {
    this.element.on('mousedown', this.bound('clickedElement'));
    if (this.wheel) {
      this.element.on('mousewheel', this.bound('scrolledElement'));
    }
    this.drag.attach();
    return this;
  };

  Slider.prototype.detach = function() {
    this.element.un('mousedown', this.bound('clickedElement'));
    this.element.un('mousewheel', this.bound('scrolledElement'));
    this.drag.detach();
    return this;
  };

  Slider.prototype.updateSize = function() {
    this.setSliderDimensions();
    this.setKnobPosition(this.toPosition(this.step));
    this.drag.limits[this.axis] = [-this.offset, this.full - this.offset];
    if (this.snap) {
      this.setSnap();
    }
    return this;
  };

  Slider.prototype.setSnap = function() {
    this.drag.grid[this.axis] = Math.ceil(this.stepWidth);
    this.drag.limits[this.axis][1] = this.element[this.offsetProperty];
    return this;
  };

  Slider.prototype.setKnobPosition = function(position) {
    if (this.snap) {
      position = this.toPosition(this.step);
    }
    this.knob.setStyle(this.property, position);
    return this;
  };

  Slider.prototype.setSliderDimensions = function() {
    this.full = this.element[this.offsetProperty] - this.knob[this.offsetProperty] + this.offset * 2;
    this.half = this.knob[this.offsetProperty] / 2;
    return this;
  };

  Slider.prototype.setStep = function(step, silently) {
    if (!(this.range > 0 ^ step < this.min)) {
      step = this.min;
    }
    if (!(this.range > 0 ^ step > this.max)) {
      step = this.max;
    }
    this.step = step.round(this.modulus.decimalLength);
    if (silently) {
      this.checkStep();
      this.setKnobPosition(this.toPosition(this.step));
    } else {
      this.checkStep();
      this.emit('tick', this.toPosition(this.step));
      this.emit('move');
      this.end();
    }
    return this;
  };

  Slider.prototype.setRange = function(range, pos, silently) {
    this.min = range ? range[0] : 0;
    this.max = range ? range[1] : this.steps;
    this.range = this.max - this.min;
    this.steps = this.steps || this.full;
    this.stepSize = Math.abs(this.range) / this.steps;
    this.stepWidth = this.stepSize * this.full / Math.abs(this.range);
    this.setModulus();
    if (range) {
      this.setStep(Array.pick([pos, this.step]).limit(this.min, this.max), silently);
    }
    return this;
  };

  Slider.prototype.setModulus = function() {
    var decimals, modulus;
    decimals = ((this.stepSize + '').split('.')[1] || []).length;
    modulus = 1 + '';
    while (decimals--) {
      modulus += '0';
    }
    this.modulus = {
      multiplier: modulus.toInt(10),
      decimalLength: modulus.length - 1
    };
  };

  Slider.prototype.clickedElement = function(event) {
    var dir, position;
    if (this.isDragging || event.target === this.knob) {
      return;
    }
    dir = this.range < 0 ? -1 : 1;
    position = event.page[this.axis] - this.element.getPosition()[this.axis] - this.half;
    position = position.limit(-this.offset, this.full - this.offset);
    this.step = (this.min + dir * this.toStep(position)).round(this.modulus.decimalLength);
    this.setKnobPosition(this.toPosition(this.step));
    this.checkStep();
    this.emit('tick', position);
    this.emit('move');
    this.end();
  };

  Slider.prototype.scrolledElement = function(event) {
    var mode;
    mode = this.mode === 'horizontal' ? event.wheel < 0 : event.wheel > 0;
    this.setStep(this.step + (mode ? -1 : 1) * this.stepSize);
    event.stop();
  };

  Slider.prototype.draggedKnob = function() {
    var dir, position;
    dir = this.range < 0 ? -1 : 1;
    position = this.drag.value.now[this.axis];
    position = position.limit(-this.offset, this.full - this.offset);
    this.step = (this.min + dir * this.toStep(position)).round(this.modulus.decimalLength);
    this.checkStep();
    this.emit('move');
  };

  Slider.prototype.checkStep = function() {
    var step;
    step = this.step;
    if (this.previousChange !== step) {
      this.previousChange = step;
      this.emit('change', step);
    }
    return this;
  };

  Slider.prototype.end = function() {
    var step;
    step = this.step;
    if (this.previousEnd !== step) {
      this.previousEnd = step;
      this.emit('complete', step + '');
    }
    return this;
  };

  Slider.prototype.toStep = function(position) {
    var step;
    step = (position + this.offset) * this.stepSize / this.full * this.steps;
    if (this.steps) {
      return (step - (step * this.modulus.multiplier % this.stepSize * this.modulus.multiplier / this.modulus.multiplier)).round(this.modulus.decimalLength);
    } else {
      return step;
    }
  };

  Slider.prototype.toPosition = function(step) {
    return this.full * Math.abs(this.min - step) / this.steps * this.stepSize - this.offset || 0;
  };

  return Slider;

})(Miwo.Object);

module.exports = Slider;


},{"./Drag":12}],14:[function(require,module,exports){
module.exports = {
  Drag: require('./Drag'),
  Slider: require('./Slider')
};


},{"./Drag":12,"./Slider":13}],15:[function(require,module,exports){
var DropdownDivider,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

DropdownDivider = (function(_super) {
  __extends(DropdownDivider, _super);

  function DropdownDivider() {
    return DropdownDivider.__super__.constructor.apply(this, arguments);
  }

  DropdownDivider.prototype.xtype = "dropdowndivider";

  DropdownDivider.prototype.el = 'li';

  DropdownDivider.prototype.baseCls = 'dropdown-divider';

  DropdownDivider.prototype.componentCls = 'divider';

  return DropdownDivider;

})(Miwo.Component);

module.exports = DropdownDivider;


},{}],16:[function(require,module,exports){
var DropdownManager,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

DropdownManager = (function(_super) {
  __extends(DropdownManager, _super);

  DropdownManager.prototype.active = null;

  function DropdownManager() {
    DropdownManager.__super__.constructor.apply(this, arguments);
    document.on('mousedown', this.bound('onBodyClick'));
    document.on('keyup', this.bound('onBodyKeyup'));
    return;
  }

  DropdownManager.prototype.register = function(component) {
    this.mon(component, 'show', 'onShow');
    this.mon(component, 'hide', 'onHide');
  };

  DropdownManager.prototype.unregister = function(component) {
    this.mun(component, 'show', 'onShow');
    this.mun(component, 'hide', 'onHide');
  };

  DropdownManager.prototype.onShow = function(component) {
    if (this.active) {
      this.active.hide();
    }
    this.active = component;
  };

  DropdownManager.prototype.onHide = function(component) {
    this.active = null;
  };

  DropdownManager.prototype.onBodyClick = function(e) {
    if (this.active && this.isOutClick(e.target, this.active)) {
      this.active.hide();
    }
  };

  DropdownManager.prototype.onBodyKeyup = function(e) {
    if (this.active && e.key === 'esc') {
      e.stop();
      this.active.hide();
    }
  };

  DropdownManager.prototype.isOutClick = function(target, active) {
    var parent;
    parent = target;
    while (parent = parent.getParent()) {
      if (parent === active.el || parent === active.target) {
        return false;
      }
    }
    return true;
  };

  return DropdownManager;

})(Miwo.Object);

module.exports = DropdownManager;


},{}],17:[function(require,module,exports){
var DropdownItem,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

DropdownItem = (function(_super) {
  __extends(DropdownItem, _super);

  function DropdownItem() {
    return DropdownItem.__super__.constructor.apply(this, arguments);
  }

  DropdownItem.prototype.xtype = "dropdownitem";

  DropdownItem.prototype.el = 'li';

  DropdownItem.prototype.baseCls = 'dropdown-menuitem';

  DropdownItem.prototype.text = "";

  DropdownItem.prototype.disabled = false;

  DropdownItem.prototype.handler = null;

  DropdownItem.prototype.linkEl = null;

  DropdownItem.prototype.role = 'presentation';

  DropdownItem.prototype.setText = function(text) {
    this.text = text;
    if (this.linkEl) {
      this.linkEl.set("html", text);
    }
  };

  DropdownItem.prototype.setHandler = function(handler) {
    this.handler = handler;
  };

  DropdownItem.prototype.doRender = function() {
    this.linkEl = new Element("a", {
      href: '#click',
      role: 'menuitem',
      html: this.text,
      parent: this.el
    });
    this.mon(this.linkEl, 'click', 'onClick');
  };

  DropdownItem.prototype.onClick = function(e) {
    e.stop();
    if (this.disabled) {
      return;
    }
    this.container.hide();
    this.emit('click', this, e);
    this.click(e);
  };

  DropdownItem.prototype.click = function(e) {
    if (Type.isFunction(this.handler)) {
      this.handler(this, e);
    } else if (Type.isString(this.handler)) {
      if (this.handler.indexOf('#') === 0) {
        document.location.hash = this.handler;
      } else {
        document.location = this.handler;
      }
    }
  };

  return DropdownItem;

})(Miwo.Component);

module.exports = DropdownItem;


},{}],18:[function(require,module,exports){
var Divider, DropdownList, Item,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Item = require('./Item');

Divider = require('./Divider');

DropdownList = (function(_super) {
  __extends(DropdownList, _super);

  function DropdownList() {
    return DropdownList.__super__.constructor.apply(this, arguments);
  }

  DropdownList.prototype.xtype = "dropdownlist";

  DropdownList.prototype.el = "ul";

  DropdownList.prototype.baseCls = "dropdown-menu";

  DropdownList.prototype.target = null;

  DropdownList.prototype.visible = false;

  DropdownList.prototype.role = 'menu';

  DropdownList.prototype.zIndexManage = true;

  DropdownList.prototype.afterInit = function() {
    DropdownList.__super__.afterInit.apply(this, arguments);
    miwo.dropdownMgr.register(this);
    this.renderTo = miwo.body;
  };

  DropdownList.prototype.addItem = function(name, config) {
    return this.add(name, new Item(config));
  };

  DropdownList.prototype.addDivider = function() {
    return this.add(new Divider());
  };

  DropdownList.prototype.doShow = function() {
    var pos;
    DropdownList.__super__.doShow.apply(this, arguments);
    pos = this.target.getPosition();
    pos.y += this.target.getSize().y - 3;
    this.setPosition(pos);
    this.toFront();
  };

  DropdownList.prototype.toggle = function() {
    if (this.visible) {
      this.hide();
    } else {
      this.show();
    }
  };

  DropdownList.prototype.doHide = function() {
    DropdownList.__super__.doHide.apply(this, arguments);
    this.resetRendered(true);
    this.toBack();
  };

  DropdownList.prototype.doDestroy = function() {
    miwo.dropdownMgr.unregister(this);
    return DropdownList.__super__.doDestroy.apply(this, arguments);
  };

  return DropdownList;

})(Miwo.Container);

module.exports = DropdownList;


},{"./Divider":15,"./Item":17}],19:[function(require,module,exports){
module.exports = {
  Divider: require('./Divider'),
  Item: require('./Item'),
  List: require('./List')
};


},{"./Divider":15,"./Item":17,"./List":18}],20:[function(require,module,exports){
var Condition, Rule, Rules, Validators,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Validators = require('./Validators');

Rule = (function() {
  Rule.prototype.isRule = true;

  Rule.prototype.rules = null;

  Rule.prototype.control = null;

  Rule.prototype.name = null;

  Rule.prototype.operation = null;

  Rule.prototype.isNegative = false;

  Rule.prototype.param = null;

  Rule.prototype.message = null;

  function Rule(rules, config) {
    var n, v;
    this.rules = rules;
    if (config == null) {
      config = {};
    }
    this.control = this.rules.control;
    for (n in config) {
      v = config[n];
      this[n] = v;
    }
    if (!this.message) {
      if (Type.isString(this.operation)) {
        this.message = miwo.tr("miwo.rules." + this.operation) || "Error";
      } else {
        this.message = "";
      }
    }
    if (Type.isString(this.operation)) {
      if (this.operation[0] === "!") {
        this.isNegative = true;
        this.operation = this.operation.replace("!", "");
      }
      this.name = this.operation;
      if (!Validators[this.operation]) {
        throw new Error("Undefined validator '" + this.operation + "' for control '" + this.control.name + "'");
      }
      this.operation = (function(_this) {
        return function(control, param) {
          return Validators[_this.name](control, param);
        };
      })(this);
    } else {
      this.name = "callback";
    }
    if (!Type.isFucntion(this.operation)) {
      throw new Error("Unknown operation '" + this.operation + "' for control '" + this.control.name + "'");
    }
    return;
  }

  Rule.prototype.validate = function() {
    var result;
    if (!this.control.required && !this.control.isFilled()) {
      return true;
    }
    result = this.operation(this.control, this.param);
    return (this.isNegative ? !result : result);
  };

  Rule.prototype.getControl = function() {
    return this.control;
  };

  return Rule;

})();

Condition = (function(_super) {
  __extends(Condition, _super);

  Condition.prototype.isCondition = true;

  Condition.prototype.subRules = null;

  function Condition(rules, config) {
    Condition.__super__.constructor.call(this, rules, config);
    this.subRules = new Rules(this.control, rules);
    return;
  }

  return Condition;

})(Rule);

Rules = (function() {
  Rules.formatMessage = function(rule) {
    var message;
    message = rule.message;
    message = message.replace("%name", rule.control.getName());
    message = message.replace("%label", rule.control.label);
    message = message.replace("%value", rule.control.getValue());
    return message;
  };

  Rules.prototype.parent = null;

  Rules.prototype.control = null;

  Rules.prototype.rules = null;

  Rules.prototype.condition = null;

  function Rules(control, parent) {
    this.parent = parent;
    this.control = control;
    this.rules = [];
  }

  Rules.prototype.setRules = function(rules) {
    this.rules = [];
    this.addRules(rules);
  };

  Rules.prototype.addRules = function(rules) {
    var elseRules, rule, subRules, _i, _len;
    for (_i = 0, _len = rules.length; _i < _len; _i++) {
      rule = rules[_i];
      if (rule.type === "condition") {
        subRules = this.addConditionOn(rule.conditionOn || this, rule.operation, rule.param);
        if (rule.rules) {
          subRules.setRules(rule.rules);
        }
        if (rule.elseRules) {
          elseRules = this.elseCondition();
          elseRules.setRules(rule.elseRules);
        }
      } else {
        this.addRule(rule.operation, rule.message, rule.param);
      }
    }
  };

  Rules.prototype.addRule = function(operation, message, param) {
    var rule;
    rule = new Rule(this, {
      operation: operation,
      message: message,
      param: param
    });
    this.rules.push(rule);
    return this;
  };

  Rules.prototype.hasRule = function(name) {
    return !!this.rules.some(function(rule) {
      return rule.name === name;
    });
  };

  Rules.prototype.addCondition = function(operation, param) {
    return this.addConditionOn(this.control, operation, param);
  };

  Rules.prototype.addConditionOn = function(control, operation, param) {
    var rule;
    rule = new Condition(this, {
      operation: operation,
      param: param
    });
    this.condition = rule;
    this.rules.push(rule);
    return rule.subRules;
  };

  Rules.prototype.elseCondition = function() {
    var rule;
    rule = new Condition(this, {
      operation: this.condition.operation,
      isNegative: !this.condition.isNegative,
      param: this.condition.param
    });
    this.rules.push(rule);
    return rule.subRules;
  };

  Rules.prototype.endCondition = function() {
    return this.parent;
  };

  Rules.prototype.validate = function(onlyCheck) {
    var rule, success, _i, _len, _ref;
    _ref = this.rules;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      rule = _ref[_i];
      if (rule.getControl().isDisabled()) {
        continue;
      }
      success = rule.validate();
      if (rule.isCondition && success) {
        if (!rule.subRules.validate(onlyCheck)) {
          return false;
        }
      } else if (rule.isRule && !success) {
        if (!onlyCheck) {
          return rule.getControl().addError(Rules.formatMessage(rule));
        }
        return false;
      }
    }
    return true;
  };

  return Rules;

})();

module.exports = Rules;


},{"./Validators":21}],21:[function(require,module,exports){
var Validators;

Validators = {
  mailRe: /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
  urlRe: /^(ftp|http|https)?:\/\/[A-Za-z0-9\.-]{1,}\.[A-Za-z]{2}/,
  intRe: /^\d+$/,
  colorRe: /^\#[a-z0-9A-Z]{6}/,
  dateRe: /^[0-9]{4}-[0-9]{2}-[0-9]{2}$/,
  numberRe: /^-{0,1}\d*\.{0,1}\d+$/,
  registerValidator: function(name, validator) {
    this[name] = validator;
  },
  equal: function(control, arg) {
    if (Type.isString(arg)) {
      arg = control.getForm().getField(arg);
    }
    return control.getStringValue() === arg.getStringValue();
  },
  filled: function(control) {
    return control.isFilled();
  },
  valid: function(control) {
    return control.rules.validate(true);
  },
  minLength: function(control, length) {
    return reutrn(control.getStringValue().length >= length);
  },
  maxLength: function(control, length) {
    return control.getStringValue().length <= length;
  },
  length: function(control, range) {
    var len;
    if (!Type.isArray(range)) {
      range = [range, range];
    }
    len = control.getStringValue().length;
    return len >= range[0] && len <= range[1];
  },
  date: function(control) {
    return this.dateRe.test(control.getStringValue());
  },
  email: function(control) {
    return this.mailRe.test(control.getStringValue());
  },
  url: function(control) {
    return this.urlRe.test(control.getStringValue());
  },
  pattern: function(control, pattern) {
    return pattern.test(control.getStringValue());
  },
  number: function(control) {
    return this.numberRe.test(control.getStringValue());
  },
  integer: function(control) {
    return this.intRe.test(control.getStringValue());
  },
  float: function(control) {
    return this.numberRe.test(control.getStringValue());
  },
  range: function(control, range) {
    if (!Type.isArray(range)) {
      range = [range, range];
    }
    return control.getValue() >= range[0] && control.getValue() <= range[1];
  },
  min: function(control, length) {
    return control.getValue() >= length;
  },
  max: function(control, length) {
    return control.getValue() <= length;
  },
  color: function(control) {
    return this.colorRe.test(control.getStringValue());
  }
};

module.exports = Validators;


},{}],22:[function(require,module,exports){
var BaseContainer,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

BaseContainer = (function(_super) {
  __extends(BaseContainer, _super);

  function BaseContainer() {
    return BaseContainer.__super__.constructor.apply(this, arguments);
  }

  BaseContainer.prototype.form = null;

  BaseContainer.prototype.autoShowErrorTip = true;

  BaseContainer.prototype.isFormContainer = true;

  BaseContainer.prototype.disabled = false;

  BaseContainer.prototype.readonly = false;

  BaseContainer.prototype.wasDirty = false;

  BaseContainer.prototype.wasValid = true;

  BaseContainer.prototype.controls = null;

  BaseContainer.prototype.layout = 'form';

  BaseContainer.registerControl = function(controlName, fn) {
    var addMethod;
    if (!fn) {
      throw new Error("Error in registry control " + controlName + ", constructor is undefined");
    }
    addMethod = 'add' + controlName.capitalize();
    this.prototype[addMethod] = function(name, config) {
      if (config == null) {
        config = {};
      }
      return this.add(name, new fn(config));
    };
  };

  BaseContainer.prototype.beforeInit = function() {
    BaseContainer.__super__.beforeInit.call(this);
    this.controls = [];
  };

  BaseContainer.prototype.afterInit = function() {
    BaseContainer.__super__.afterInit.call(this);
    this.updateValidationBoundItems(this.isValid(true));
  };

  BaseContainer.prototype.addedComponent = function(component) {
    BaseContainer.__super__.addedComponent.call(this, component);
    if (component.isFormControl) {
      component.form = this.form;
      this.controls.push(component);
      this.mon(component, 'validitychange', 'checkValidity');
      this.mon(component, 'dirtychange', 'checkDirty');
      this.mon(component, 'focus', 'onInputFieldFocus');
    } else if (component.isFormContainer) {
      component.form = this.form;
      this.mon(component, 'inputfocus', 'onInputFieldFocus');
    }
    if (this.disabled) {
      component.setDisabled(this.disabled);
    }
    if (this.readonly) {
      component.setReadonly(this.readonly);
    }
  };

  BaseContainer.prototype.removedComponent = function(component) {
    BaseContainer.__super__.removedComponent.call(this, component);
    if (component.isFormControl) {
      component.form = null;
      this.controls.erase(component);
      this.mun(component);
    } else if (component.isFormContainer) {
      component.form = null;
      this.mun(component);
    }
  };

  BaseContainer.prototype.setDisabled = function(disabled) {
    this.disabled = disabled;
    this.getComponents().each(function(component) {
      if (component.setDisabled) {
        component.setDisabled(disabled);
      }
    });
  };

  BaseContainer.prototype.setReadonly = function(readonly) {
    this.readonly = readonly;
    this.getComponents().each(function(component) {
      if (component.setReadonly) {
        component.setReadonly(readonly);
      }
    });
  };

  BaseContainer.prototype.getControls = function() {
    return this.controls;
  };

  BaseContainer.prototype.getControl = function(name) {
    var control, _i, _len, _ref;
    _ref = this.controls;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      control = _ref[_i];
      if (control.name === name) {
        return control;
      }
    }
    throw new Error("Control " + name + " not found");
  };

  BaseContainer.prototype.getFocusControl = function() {
    var control, _i, _len, _ref;
    _ref = this.controls;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      control = _ref[_i];
      if (!control.disabled) {
        return control;
      }
    }
    return null;
  };

  BaseContainer.prototype.onInputFieldFocus = function(form, input) {
    this.emit("inputfocus", this, input || form);
  };

  BaseContainer.prototype.getValidationBoundItems = function() {
    return this.findComponents(true, {
      validationBind: true
    });
  };

  BaseContainer.prototype.getValues = function(dirtyOnly, submitable) {
    var control, values, _i, _len, _ref;
    values = {};
    _ref = this.controls;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      control = _ref[_i];
      if ((!submitable || control.submitValue) && !control.disabled) {
        if (!dirtyOnly || control.isDirty()) {
          values[control.getName()] = control.getValue();
        }
      }
    }
    return values;
  };

  BaseContainer.prototype.getRawValues = function(dirtyOnly, submitable) {
    var control, values, _i, _len, _ref;
    values = {};
    _ref = this.controls;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      control = _ref[_i];
      if ((!submitable || control.submitValue) && !control.disabled) {
        if (!dirtyOnly || control.isDirty()) {
          values[control.getName()] = control.getRawValue();
        }
      }
    }
    return values;
  };

  BaseContainer.prototype.getOriginalValues = function() {
    var control, values, _i, _len, _ref;
    values = {};
    _ref = this.controls;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      control = _ref[_i];
      values[control.getName()] = control.getRawValue();
    }
    return values;
  };

  BaseContainer.prototype.getErrors = function() {
    var control, error, errors, _i, _j, _len, _len1, _ref, _ref1;
    errors = [];
    _ref = this.controls;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      control = _ref[_i];
      _ref1 = control.getErrors();
      for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
        error = _ref1[_j];
        errors.include(error);
      }
    }
    return errors;
  };

  BaseContainer.prototype.setValues = function(values, erase, setOriginals) {
    var control, name, _i, _len, _ref;
    _ref = this.controls;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      control = _ref[_i];
      name = control.getName();
      if (values.hasOwnProperty(name)) {
        control.setValue(values[name]);
        if (setOriginals) {
          control.setOriginalValue(values[name]);
        }
      } else if (erase) {
        control.setValue(null);
        if (setOriginals) {
          control.setOriginalValue(null);
        }
      }
    }
  };

  BaseContainer.prototype.setOriginals = function(values, erase) {
    var control, name, _i, _len, _ref;
    if (!values) {
      values = this.getValues();
    }
    _ref = this.controls;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      control = _ref[_i];
      name = control.getName();
      if (values.hasOwnProperty(name)) {
        control.setOriginalValue(values[name]);
      } else if (erase) {
        control.setOriginalValue(null);
      }
    }
  };

  BaseContainer.prototype.resetOriginals = function() {
    var control, _i, _len, _ref;
    _ref = this.controls;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      control = _ref[_i];
      control.resetOriginalValue();
    }
  };

  BaseContainer.prototype.setDefaults = function(values, onlySet) {
    var control, name, _i, _len, _ref;
    _ref = this.controls;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      control = _ref[_i];
      name = control.getName();
      if (values) {
        if (values.hasOwnProperty(name)) {
          control.setDefaultValue(values[name]);
        } else if (!onlySet) {
          control.setDefaultValue();
        }
      } else {
        control.setDefaultValue();
      }
    }
  };

  BaseContainer.prototype.reset = function(resetOriginalValues) {
    var control, _i, _len, _ref;
    if (resetOriginalValues) {
      this.setOriginals({}, true);
    }
    _ref = this.controls;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      control = _ref[_i];
      control.reset();
    }
  };

  BaseContainer.prototype.isValid = function(onlyCheck) {
    var control, invalid, valid, _i, _len, _ref;
    valid = true;
    invalid = void 0;
    _ref = this.controls;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      control = _ref[_i];
      if (!onlyCheck) {
        control.notifyErrors = true;
      }
      if (!control.validate()) {
        valid = false;
        if (!invalid) {
          invalid = control;
        }
        if (onlyCheck && !valid) {
          break;
        }
      }
    }
    if (this.autoShowErrorTip && !onlyCheck && invalid) {
      if (invalid.errorTip) {
        invalid.errorTip.show();
      }
    }
    return valid;
  };

  BaseContainer.prototype.validate = function() {
    return this.isValid();
  };

  BaseContainer.prototype.checkValidity = function() {
    var valid;
    valid = this.isValid(true);
    if (valid !== this.wasValid) {
      this.updateValidationBoundItems(valid);
      this.emit("validitychange", this, valid);
      this.wasValid = valid;
    }
  };

  BaseContainer.prototype.updateValidationBoundItems = function(valid) {
    var control, _i, _len, _ref;
    _ref = this.getValidationBoundItems();
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      control = _ref[_i];
      if (control.disabled === valid) {
        control.setDisabled(!valid);
      }
    }
  };

  BaseContainer.prototype.checkDirty = function() {
    var dirty;
    dirty = this.isDirty();
    if (dirty !== this.wasDirty) {
      this.emit("dirtychange", this, dirty);
      this.wasDirty = dirty;
    }
  };


  /**
  	  Returns `true` if any controls in this form have changed from their original values.
  	  @return {Boolean}
   */

  BaseContainer.prototype.isDirty = function() {
    var control, _i, _len, _ref;
    _ref = this.controls;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      control = _ref[_i];
      if (control.isDirty()) {
        return true;
      }
    }
    return false;
  };

  return BaseContainer;

})(Miwo.Container);

module.exports = BaseContainer;


},{}],23:[function(require,module,exports){
var BaseContainer, Fieldset,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

BaseContainer = require('./BaseContainer');

Fieldset = (function(_super) {
  __extends(Fieldset, _super);

  function Fieldset() {
    return Fieldset.__super__.constructor.apply(this, arguments);
  }

  Fieldset.prototype.legend = '';

  Fieldset.prototype.beforeInit = function() {
    Fieldset.__super__.beforeInit.apply(this, arguments);
    this.xtype = 'fieldset';
    this.element = 'fieldset';
  };

  Fieldset.prototype.beforeRender = function() {
    Fieldset.__super__.beforeRender.apply(this, arguments);
    this.legendEl = new Element('legend', {
      parent: this.el,
      html: this.legend
    });
    this.contentEl = new Element('div', {
      parent: this.el,
      cls: 'fieldset-content'
    });
  };

  return Fieldset;

})(BaseContainer);

BaseContainer.registerControl('fieldset', Fieldset);

module.exports = Fieldset;


},{"./BaseContainer":22}],24:[function(require,module,exports){
var BaseContainer, Form,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

BaseContainer = require('./BaseContainer');

Form = (function(_super) {
  __extends(Form, _super);

  function Form() {
    return Form.__super__.constructor.apply(this, arguments);
  }

  Form.prototype.xtype = 'form';

  Form.prototype.el = 'form';

  Form.prototype.buttonsEl = null;

  Form.prototype.record = null;

  Form.prototype.submitBtn = null;

  Form.prototype.renderer = null;

  Form.prototype.rendererType = 'default';

  Form.prototype.rendererOptions = null;

  Form.prototype.preventAutoLogin = false;

  Form.prototype.beforeInit = function() {
    Form.__super__.beforeInit.call(this);
    this.form = this;
  };

  Form.prototype.afterInit = function() {
    Form.__super__.afterInit.call(this);
    this.keyListener = new Miwo.utils.KeyListener(this.el, 'keydown');
    this.keyListener.on('enter', (function(_this) {
      return function(e) {
        if (e.target.tagName !== 'TEXTAREA') {
          _this.submit();
          return true;
        }
        return false;
      };
    })(this));
  };

  Form.prototype.reset = function(btn, silent) {
    Form.__super__.reset.call(this);
    if (!silent) {
      this.emit('reset', this, btn);
    }
  };

  Form.prototype.addedComponentDeep = function(component) {
    Form.__super__.addedComponentDeep.call(this, component);
    if (component.isFormControl || component.isFormContainer) {
      component.form = this.form;
    }
    if (component.isSubmitButton) {
      this.mon(component, 'click', 'onSubmitButtonClick');
    } else if (component.isResetButton) {
      this.mon(component, 'click', 'onResetButtonClick');
    }
  };

  Form.prototype.removedComponentDeep = function(component) {
    Form.__super__.removedComponentDeep.call(this, component);
    if (component.isFormControl || component.isFormContainer) {
      component.form = null;
    }
    if (component.isSubmitButton) {
      this.mun(component);
    } else if (component.isResetButton) {
      this.mun(component);
    }
  };

  Form.prototype.onSubmitButtonClick = function(btn) {
    this.submit(btn);
  };

  Form.prototype.onResetButtonClick = function(btn) {
    this.reset(btn);
  };

  Form.prototype.loadRecord = function(record) {
    var values;
    if (!record) {
      throw new Error("Undefined record");
    }
    this.record = record;
    values = record.getValues();
    this.setOriginals(values);
    this.setValues(values);
    this.reset(null, true);
  };

  Form.prototype.unloadRecord = function() {
    this.record = null;
    this.setOriginals({}, true);
    this.setValues({});
    this.reset(null, true);
  };

  Form.prototype.updateRecord = function(record) {
    var name, values;
    record = record || this.record;
    if (!record) {
      throw new Error("Undefined record. First you must call 'loadRecord' or pass record in this method");
    }
    values = this.getValues(true, true);
    for (name in record.fields) {
      if (values.hasOwnProperty(name)) {
        record.set(name, values[name]);
      }
    }
    return record;
  };

  Form.prototype.editRecord = function(record) {
    record = record || this.record;
    if (!record) {
      throw new Error("Undefined record. First you must call 'loadRecord' or pass record in this method");
    }
    record.beginEdit();
    this.updateRecord(record);
    record.endEdit();
    return record;
  };

  Form.prototype.submit = function(btn) {
    var isValid;
    this.submitBtn = btn;
    isValid = this.validate();
    this.onSubmit();
    this.emit('submit', this, isValid);
    if (isValid) {
      this.onSuccess();
      this.emit('success', this);
    } else {
      this.onFailure();
      this.emit('failure', this);
    }
  };

  Form.prototype.onSuccess = function() {};

  Form.prototype.onFailure = function() {};

  Form.prototype.onSubmit = function() {};

  Form.prototype.renderContainer = function() {
    var buttons, contentEl, control, controls, el, _i, _j, _k, _l, _len, _len1, _len2, _len3, _len4, _len5, _m, _n, _ref, _ref1, _ref2, _ref3, _ref4;
    Form.__super__.renderContainer.call(this);
    contentEl = this.getContentEl();
    this.getRenderer().renderForm(this);
    _ref = this.getElements("[miwo-label]");
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      el = _ref[_i];
      control = this.get(el.getAttribute("miwo-label"), true);
      control.labelEl = el;
      control.labelRendered = true;
    }
    _ref1 = this.getElements("[miwo-group]");
    for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
      el = _ref1[_j];
      control = this.get(el.getAttribute("miwo-group"), true);
      control.groupEl = el;
      control.el = el;
      control.parentEl = contentEl;
    }
    _ref2 = this.getElements("[miwo-controls]");
    for (_k = 0, _len2 = _ref2.length; _k < _len2; _k++) {
      el = _ref2[_k];
      control = this.get(el.getAttribute("miwo-controls"), true);
      control.controlsEl = el;
      control.labelRendered = true;
      this.detectControlGroupEl(control, el, contentEl);
    }
    _ref3 = this.getElements("[miwo-control]");
    for (_l = 0, _len3 = _ref3.length; _l < _len3; _l++) {
      el = _ref3[_l];
      control = this.get(el.getAttribute("miwo-control"), true);
      control.controlEl = el;
      control.controlsRendered = true;
      this.detectControlGroupEl(control, el, contentEl);
    }
    _ref4 = this.getElements("[miwo-input]");
    for (_m = 0, _len4 = _ref4.length; _m < _len4; _m++) {
      el = _ref4[_m];
      control = this.get(el.getAttribute("miwo-input"), true);
      control.inputEl = el;
      control.controlsRendered = true;
      control.controlRendered = true;
      this.detectControlGroupEl(control, el, contentEl);
    }
    controls = this.findComponents(false, {
      isFormControl: true,
      isFormContainer: true
    });
    for (_n = 0, _len5 = controls.length; _n < _len5; _n++) {
      control = controls[_n];
      if (control.isFormControl) {
        this.getRenderer().renderGroup(control, contentEl);
        control.groupEl.set('miwo-name', control.name);
        control.afterRender();
        control.rendered = true;
      } else {
        control.render(contentEl);
      }
    }
    buttons = this.findComponents(false, {
      isButton: true
    });
    if (buttons.length > 0) {
      this.getRenderer().renderButtons(buttons, this.getButtonsEl());
    }
  };

  Form.prototype.detectControlGroupEl = function(control, el, contentEl) {
    var controlEl;
    if ((controlEl = el.getParent('.form-group'))) {
      control.el = controlEl;
      control.parentEl = contentEl;
      if (!control.groupEl) {
        control.groupEl = controlEl;
      }
    }
  };

  Form.prototype.getButtonsEl = function() {
    var ct;
    if (!this.buttonsEl) {
      ct = new Element('div', {
        parent: this.getContentEl(),
        cls: 'form-group'
      });
      this.buttonsEl = new Element('div', {
        parent: ct
      });
      this.buttonsEl.generated = true;
    }
    return this.buttonsEl;
  };

  Form.prototype.getRenderer = function() {
    if (!this.renderer) {
      this.renderer = miwo.service('formRendererFactory').create(this.rendererType, this.rendererOptions);
    }
    return this.renderer;
  };

  Form.prototype.doDestroy = function() {
    this.keyListener.destroy();
    return Form.__super__.doDestroy.call(this);
  };

  return Form;

})(BaseContainer);

module.exports = Form;


},{"./BaseContainer":22}],25:[function(require,module,exports){
var BaseControl, Button, Rules,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Button = require('../../buttons/Button');

Rules = require('../Rules');

BaseControl = (function(_super) {
  __extends(BaseControl, _super);

  function BaseControl() {
    return BaseControl.__super__.constructor.apply(this, arguments);
  }

  BaseControl.prototype.xtype = 'control';

  BaseControl.prototype.isFormControl = true;

  BaseControl.prototype.label = null;

  BaseControl.prototype.value = null;

  BaseControl.prototype.defaultValue = void 0;

  BaseControl.prototype.required = false;

  BaseControl.prototype.prepend = null;

  BaseControl.prototype.append = null;

  BaseControl.prototype.tip = null;

  BaseControl.prototype.help = null;

  BaseControl.prototype.desc = null;

  BaseControl.prototype.inputTag = "input";

  BaseControl.prototype.inputName = null;

  BaseControl.prototype.inputCls = null;

  BaseControl.prototype.inputWidth = null;

  BaseControl.prototype.attributes = null;

  BaseControl.prototype.disabled = false;

  BaseControl.prototype.omitted = false;

  BaseControl.prototype.validateOnChange = true;

  BaseControl.prototype.buttons = null;

  BaseControl.prototype.rules = null;

  BaseControl.prototype.form = null;

  BaseControl.prototype.labelEl = null;

  BaseControl.prototype.labeltextEl = null;

  BaseControl.prototype.input = null;

  BaseControl.prototype.controlsEl = null;

  BaseControl.prototype.descEl = null;

  BaseControl.prototype.tipEl = null;

  BaseControl.prototype.helpEl = null;

  BaseControl.prototype.preventRenderControl = false;

  BaseControl.prototype.suspendCheckChange = true;

  BaseControl.prototype.originalValue = void 0;

  BaseControl.prototype.lastValue = void 0;

  BaseControl.prototype.errors = void 0;

  BaseControl.prototype.wasDirty = false;

  BaseControl.prototype.wasValid = true;

  BaseControl.prototype.notifyErrors = false;

  BaseControl.prototype.preventUpdateErrors = false;

  BaseControl.prototype.submitValue = true;

  BaseControl.prototype.afterInit = function() {
    var button, items, rules, _i, _len;
    BaseControl.__super__.afterInit.call(this);
    this.errors = [];
    this.defaultValue = this.originalValue = this.lastValue = this.value;
    if (!Type.isInstance(this.rules)) {
      rules = Array.from(this.rules);
      this.rules = new Rules(this);
      this.initRules();
      this.rules.addRules(rules);
    }
    if (this.width) {
      this.inputWidth = this.width;
      this.width = null;
    }
    items = this.buttons;
    this.buttons = new Miwo.utils.Collection();
    if (items) {
      for (_i = 0, _len = items.length; _i < _len; _i++) {
        button = items[_i];
        this.addButton(button.name, button);
      }
    }
  };

  BaseControl.prototype.initRules = function() {
    if (this.required) {
      this.rules.addRule("filled");
    }
  };

  BaseControl.prototype.getValue = function() {
    return this.value;
  };

  BaseControl.prototype.getRawValue = function() {
    return (this.input ? this.input.getValue() : void 0);
  };

  BaseControl.prototype.getStringValue = function() {
    var val;
    val = this.getValue();
    return (val !== null && val !== undefined ? val.toString() : "");
  };

  BaseControl.prototype.setValue = function(value) {
    this.value = value;
    this.checkChange();
    return this;
  };

  BaseControl.prototype.setOriginalValue = function(value) {
    this.originalValue = value;
    this.checkDirty();
    return this;
  };

  BaseControl.prototype.setDefaultValue = function(value) {
    if (value) {
      this.defaultValue = value;
    }
    this.setValue(this.defaultValue);
    return this;
  };

  BaseControl.prototype.setFocus = function() {
    BaseControl.__super__.setFocus.call(this);
    this.emit("focus", this);
    return this;
  };

  BaseControl.prototype.isDisabled = function() {
    return this.disabled;
  };

  BaseControl.prototype.setDisabled = function(disabled) {
    this.disabled = disabled;
    this.input.setDisabled(this.disabled);
    return this;
  };

  BaseControl.prototype.isFilled = function() {
    return this.getStringValue() !== "";
  };

  BaseControl.prototype.isEqual = function(value1, value2) {
    return value1 === value2;
  };


  /**
  	  Returns the parameter(s) that would be included in a standard form submit for this field. Typically this will be
  	  an object with a single name-value pair, the name being this field's {@link #getName name} and the value being
  	  its current stringified value. More advanced field implementations may return more than one name-value pair.
  
  	  Note that the values returned from this method are not guaranteed to have been successfully {@link #validate
  	  validated}.
  
  	  @param {Boolean} submitable Only submitable values
  	  @return {Object} A mapping of submit parameter names to values; each value should be a string, or an array of
  	  strings if that particular name has multiple values. It can also return null if there are no parameters to be
  	  submitted.
   */

  BaseControl.prototype.getData = function(submitable) {
    var data;
    data = null;
    if (!this.disabled && (!submitable || !this.omitted) && !this.isFileUpload) {
      data = {};
      data[this.getName()] = "" + this.getValue();
    }
    return data;
  };

  BaseControl.prototype.reset = function() {
    this.beforeReset();
    this.setValue(this.originalValue);
    this.clearInvalid();
  };

  BaseControl.prototype.beforeReset = function() {};

  BaseControl.prototype.clearInvalid = function() {
    delete this.wasValid;
    this.notifyErrors = false;
    this.wasInputFocused = false;
    this.cleanErrors();
    return this;
  };

  BaseControl.prototype.resetOriginalValue = function() {
    this.originalValue = this.getValue();
    this.checkDirty();
    return this;
  };

  BaseControl.prototype.checkChange = function() {
    var newVal, oldVal;
    if (this.suspendCheckChange) {
      return;
    }
    newVal = this.getValue();
    oldVal = this.lastValue;
    if (!this.isEqual(newVal, oldVal) && !this.isDestroyed) {
      this.lastValue = newVal;
      this.emit("change", this, newVal, oldVal);
      this.onChange(newVal, oldVal);
    }
  };

  BaseControl.prototype.onChange = function(newVal, oldVal) {
    if (this.validateOnChange) {
      this.validate();
    }
    this.checkDirty();
  };

  BaseControl.prototype.isDirty = function() {
    return !this.disabled && !this.isEqual(this.getValue(), this.originalValue);
  };

  BaseControl.prototype.checkDirty = function() {
    var isDirty;
    isDirty = this.isDirty();
    if (isDirty !== this.wasDirty) {
      this.emit("dirtychange", this, isDirty);
      this.onDirtyChange(isDirty);
      this.wasDirty = isDirty;
    }
  };

  BaseControl.prototype.onDirtyChange = function(isDirty) {};

  BaseControl.prototype.getRules = function() {
    return this.rules;
  };

  BaseControl.prototype.getErrors = function() {
    return this.errors;
  };

  BaseControl.prototype.hasErrors = function() {
    return this.errors.length > 0;
  };

  BaseControl.prototype.addError = function(error) {
    this.errors.include(error);
    this.updateErrors();
  };

  BaseControl.prototype.addErrors = function(errors) {
    var error, _i, _len;
    for (_i = 0, _len = errors.length; _i < _len; _i++) {
      error = errors[_i];
      this.errors.include(error);
    }
    this.updateErrors();
  };

  BaseControl.prototype.cleanErrors = function() {
    this.errors.empty();
    this.updateErrors();
  };

  BaseControl.prototype.updateErrors = function() {
    if (this.preventUpdateErrors) {
      return;
    }
    this.emit("errorsupdate", this);
    if (this.input) {
      this.input.el.removeClass('has-error');
      if (this.hasErrors()) {
        this.input.el.addClass('has-error');
      }
    }
    if (this.el.hasClass('form-group')) {
      this.el.removeClass('has-error');
      if (this.hasErrors()) {
        this.el.addClass('has-error');
      }

      /*
      			if @hasErrors() and @notifyErrors
      				if !@errorTip
      					@errorTip = new Element('div', {cls:'help-block has-error'})
      					@errorTip.inject(@inputEl.getParent('.form-controls'))
      				@errorTip.set('text', @errors[0])
      			else
      				if @errorTip
      					@errorTip.destroy()
      					@errorTip = null
       */
    }
  };

  BaseControl.prototype.isValid = function(onlyCheck) {
    if (this.disabled) {
      return true;
    }
    if (this.wasValid === null || !onlyCheck) {
      this.cleanErrors();
      this.doValidate();
    }
    return !this.hasErrors();
  };

  BaseControl.prototype.doValidate = function() {
    this.preventUpdateErrors = true;
    this.getRules().validate();
    this.preventUpdateErrors = false;
    this.updateErrors();
  };


  /**
  	  Returns whether or not the field value is currently valid by {@link #getErrors validating} the field's current
  	  value, and fires the {@link #validitychange} event if the field's validity has changed since the last validation.
  	  Note**: {@link #disabled} fields are always treated as valid.
  
  	  Custom implementations of this method are allowed to have side-effects such as triggering error message display.
  	  To validate without side-effects, use {@link #isValid}.
  
  	  @param {Boolean} notifyErrors Notifikovat uzivatela o chybach
  	  @return {Boolean} True if the value is valid, else false
   */

  BaseControl.prototype.validate = function(notifyErrors) {
    var isValid;
    if (notifyErrors) {
      this.notifyErrors = notifyErrors;
    }
    isValid = this.isValid();
    if (isValid !== this.wasValid) {
      this.wasValid = isValid;
      this.emit("validitychange", this, isValid);
    }
    return isValid;
  };

  BaseControl.prototype.isRequired = function() {
    return this.rules.hasRule("filled");
  };

  BaseControl.prototype.initializeControl = function() {
    if (this.value !== null) {
      this.setValue(this.value);
    }
    this.suspendCheckChange = false;
  };

  BaseControl.prototype.getForm = function() {
    if (!this.form) {
      throw new Error("Component is not attached to Form");
    }
    return this.form;
  };

  BaseControl.prototype.setLabel = function(label) {
    this.label = label;
    if (this.labeltextEl) {
      this.labeltextEl.set('text', label);
    }
  };

  BaseControl.prototype.getLabel = function() {
    return this.label;
  };

  BaseControl.prototype.getLabelEl = function() {
    if (!this.labelEl) {
      this.labelEl = new Element('label');
    }
    return this.labelEl;
  };

  BaseControl.prototype.getInput = function() {
    if (!this.input) {
      this.input = this.createInput();
      if (!this.input) {
        throw new Error("Input was not created in createInput() in class " + this);
      }
    }
    return this.input;
  };

  BaseControl.prototype.addButton = function(name, config) {
    var button;
    button = new Button(config);
    button.getControl = (function(_this) {
      return function() {
        return _this;
      };
    })(this);
    if (this.buttonsCt) {
      button.render(this.buttonsCt);
    }
    button.on('click', (function(_this) {
      return function(btn, event) {
        _this.emit('buttonclick', _this, btn, event);
      };
    })(this));
    this.buttons.set(name, button);
    return button;
  };

  BaseControl.prototype.addResetButton = function() {
    var button;
    button = this.addButton('reset', {
      disabled: true,
      icon: 'remove',
      handler: (function(_this) {
        return function() {
          return _this.reset();
        };
      })(this)
    });
    return button;
  };

  BaseControl.prototype.getButton = function(name) {
    return this.buttons.get(name);
  };

  BaseControl.prototype.createInput = function() {};

  BaseControl.prototype.doRender = function() {
    this.renderControl(this.el);
  };

  BaseControl.prototype.renderLabel = function(ct) {
    var labelEl, requiredEl;
    labelEl = this.getLabelEl();
    labelEl.inject(ct);
    this.labeltextEl = new Element('span', {
      cls: 'control-label-text',
      html: this.getLabel()
    });
    this.labeltextEl.inject(labelEl);
    if (this.isRequired()) {
      requiredEl = new Element('span', {
        cls: 'control-label-required',
        html: '*',
        'data-toggle': 'tooltip',
        'data-title': 'Required field'
      });
      requiredEl.inject(labelEl);
    }
    return labelEl;
  };

  BaseControl.prototype.renderControl = function(ct) {
    var input, span;
    input = this.getInput();
    if (input.rendered) {
      return input;
    }
    if (this.inputWidth) {
      this.el.addClass('input-fill');
      ct.setStyle('width', this.inputWidth);
    }
    if (this.controlCls) {
      ct.addClass(this.controlCls);
    }
    if (this.prepend || this.append || this.buttons.length > 0 || this.tip) {
      ct.addClass('input-group');
    } else {
      ct.addClass('input-control');
    }
    if (this.prepend) {
      span = new Element('span', {
        cls: 'input-group-addon',
        html: this.prepend
      });
      span.inject(ct);
      span.on('click', (function(_this) {
        return function(e) {
          return _this.emit('prependclick', _this, e);
        };
      })(this));
    }
    input.render(ct);
    input.setDisabled(this.disabled);
    if (this.append) {
      span = new Element('span', {
        cls: 'input-group-addon',
        html: this.append
      });
      span.inject(ct);
      span.on('click', (function(_this) {
        return function(e) {
          return _this.emit('appendclick', _this, e);
        };
      })(this));
    }
    if (this.buttons.length !== 0) {
      this.buttonsCt = new Element('div', {
        cls: 'input-group-btn'
      });
      this.buttonsCt.inject(ct);
      this.buttons.each((function(_this) {
        return function(button) {
          return button.render(_this.buttonsCt);
        };
      })(this));
    }
    if (this.tip) {
      span = new Element('span', {
        cls: 'input-group-addon input-group-addon-tooltip',
        html: '<span class="glyphicon glyphicon-question-sign" data-title="' + this.tip + '" data-toggle="tooltip"></span>'
      });
      span.inject(ct);
      ct.addClass('input-tooltip');
    }
    return input;
  };

  BaseControl.prototype.afterRender = function() {
    BaseControl.__super__.afterRender.apply(this, arguments);
    this.afterRenderLabel();
    this.afterRenderControl();
    this.initializeControl();
  };

  BaseControl.prototype.afterRenderLabel = function() {
    if (this.labelEl && this.input.getInputId) {
      this.labelEl.set('for', this.input.getInputId());
    }
  };

  BaseControl.prototype.afterRenderControl = function() {};

  BaseControl.prototype.parentShown = function(parent) {
    BaseControl.__super__.parentShown.call(this, parent);
    this.getInput().parentShown(parent);
  };

  BaseControl.prototype.doDestroy = function() {
    if (this.input) {
      this.input.destroy();
    }
    BaseControl.__super__.doDestroy.apply(this, arguments);
  };

  return BaseControl;

})(Miwo.Component);

module.exports = BaseControl;


},{"../../buttons/Button":6,"../Rules":20}],26:[function(require,module,exports){
var BaseControl, BaseInputControl,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

BaseControl = require('./BaseControl');

BaseInputControl = (function(_super) {
  __extends(BaseInputControl, _super);

  function BaseInputControl() {
    return BaseInputControl.__super__.constructor.apply(this, arguments);
  }

  BaseInputControl.prototype.setValue = function(value, onlyControl) {
    BaseInputControl.__super__.setValue.call(this, value);
    if (this.input && !onlyControl) {
      this.input.setValue(value);
    }
    return this;
  };

  BaseInputControl.prototype.setDisabled = function(disabled) {
    BaseInputControl.__super__.setDisabled.call(this, disabled);
    if (this.input) {
      this.input.setDisabled(disabled);
    }
    return this;
  };

  BaseInputControl.prototype.setReadonly = function(readonly) {
    this.readonly = readonly;
    if (this.input && this.input.setReadonly) {
      this.input.setReadonly(this.readonly);
    }
    return this;
  };

  BaseInputControl.prototype.afterRenderControl = function() {
    var input;
    input = this.getInput();
    input.on('focus', this.bound('onInputFocus'));
    input.on('blur', this.bound('onInputBlur'));
  };

  BaseInputControl.prototype.onInputFocus = function() {
    this.setFocus();
  };

  BaseInputControl.prototype.onInputBlur = function() {
    this.validate();
    this.blur();
  };

  return BaseInputControl;

})(BaseControl);

module.exports = BaseInputControl;


},{"./BaseControl":25}],27:[function(require,module,exports){
var BaseInputControl, BaseSelectControl, Helpers,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

BaseInputControl = require('./BaseInputControl');

Helpers = require('./Helpers');

BaseSelectControl = (function(_super) {
  __extends(BaseSelectControl, _super);

  function BaseSelectControl() {
    return BaseSelectControl.__super__.constructor.apply(this, arguments);
  }

  BaseSelectControl.prototype.items = null;

  BaseSelectControl.prototype.store = null;

  BaseSelectControl.prototype.keyProperty = null;

  BaseSelectControl.prototype.textProperty = null;

  BaseSelectControl.prototype.rowBuilder = null;

  BaseSelectControl.prototype.prompt = false;

  BaseSelectControl.prototype.input = null;

  BaseSelectControl.prototype.setValue = function(value) {
    BaseSelectControl.__super__.setValue.call(this, value);
    this.setSelected(value);
  };

  BaseSelectControl.prototype.setSelected = function(value) {
    if (value || this.prompt) {
      if (this.input) {
        this.input.setValue(value);
      }
      this.emit('selected', this, value);
    }
  };

  BaseSelectControl.prototype.getItems = function() {
    return Helpers.createSelectItems(this);
  };

  BaseSelectControl.prototype.setItems = function(items) {
    Helpers.setSelectItems(this, items);
    if (!this.prompt && this.value !== null) {
      this.input.setValue(this.getValue());
    }
  };

  BaseSelectControl.prototype.buildRowContent = function(row) {
    if (this.rowBuilder) {
      return this.rowBuilder(row);
    } else {
      return null;
    }
  };

  BaseSelectControl.prototype.afterRenderControl = function() {
    BaseSelectControl.__super__.afterRenderControl.call(this);
    this.setItems(this.getItems());
    this.input.on('change', (function(_this) {
      return function(input, value) {
        return _this.setValue(value);
      };
    })(this));
    this.focusEl = this.input.focusEl;
  };

  return BaseSelectControl;

})(BaseInputControl);

module.exports = BaseSelectControl;


},{"./BaseInputControl":26,"./Helpers":38}],28:[function(require,module,exports){
var BaseInputControl, BaseTextControl, TextInput,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

BaseInputControl = require('./BaseInputControl');

TextInput = require('../../input/Text');

BaseTextControl = (function(_super) {
  __extends(BaseTextControl, _super);

  function BaseTextControl() {
    return BaseTextControl.__super__.constructor.apply(this, arguments);
  }

  BaseTextControl.prototype.placeholder = null;

  BaseTextControl.prototype.minLength = null;

  BaseTextControl.prototype.maxLength = null;

  BaseTextControl.prototype.length = null;

  BaseTextControl.prototype.autocomplete = null;

  BaseTextControl.prototype.pattern = null;

  BaseTextControl.prototype.readonly = null;

  BaseTextControl.prototype.notifyInputChange = false;

  BaseTextControl.prototype.setValueInputChange = true;

  BaseTextControl.prototype.validateOnKeyUp = false;

  BaseTextControl.prototype.resetFormOnEsc = false;

  BaseTextControl.prototype.value = '';

  BaseTextControl.prototype.type = null;

  BaseTextControl.prototype.inputCls = null;

  BaseTextControl.prototype.editable = true;

  BaseTextControl.prototype.initRules = function() {
    BaseTextControl.__super__.initRules.call(this);
    if (this.minLength) {
      this.rules.addRule("minLength", null, this.minLength);
    }
    if (this.maxLength) {
      this.rules.addRule("maxLength", null, this.maxLength);
    }
    if (this.length) {
      this.rules.addRule("length", null, this.length);
    }
  };

  BaseTextControl.prototype.createInput = function() {
    return new TextInput({
      id: this.id + 'Input',
      type: this.type || 'text',
      name: 'input',
      cls: this.inputCls,
      inputName: this.name,
      autocomplete: this.autocomplete,
      placeholder: this.placeholder,
      readonly: this.readonly,
      disabled: this.disabled
    });
  };

  BaseTextControl.prototype.afterRenderControl = function() {
    var inputEl;
    BaseTextControl.__super__.afterRenderControl.call(this);
    inputEl = this.input.getInputEl();
    if (this.minLength !== null) {
      inputEl.set("minlength", this.minLength);
    }
    if (this.maxLength !== null) {
      inputEl.set("maxlength", this.maxLength);
    }
    if (this.isRequired()) {
      inputEl.set("required", true);
    }
    this.mon(inputEl, 'keydown', 'onInputKeydown');
    this.mon(inputEl, 'keyup', 'onInputKeyup');
    this.mon(inputEl, 'change', 'onInputChange');
    this.mon(inputEl, 'focus', 'onInputFocus');
    this.mon(inputEl, 'blur', 'onInputBlur');
    this.focusEl = inputEl;
  };

  BaseTextControl.prototype.onInputChange = function() {
    if (this.setValueInputChange) {
      this.setValue(this.getRawValue(), true);
    }
    if (this.notifyInputChange) {
      this.emit("inputchange", this, this.getRawValue());
    }
  };

  BaseTextControl.prototype.onInputKeydown = function(e) {
    if (!this.editable) {
      if (e.key.length === 1) {
        e.preventDefault();
      }
      return;
    }
    if (e.key.length === 1) {
      this.onKeydown(this, e.key, e);
      this.emit("keydown", this, e.key, e);
      if (this.pattern && !this.pattern.test(e.key)) {
        e.stop();
      }
    } else {
      if (this.resetFormOnEsc && e.key === 'esc') {
        this.getForm().reset();
      }
      this.onSpecialkey(this, e.key, e);
      this.emit("specialkey", this, e.key, e);
    }
  };

  BaseTextControl.prototype.onInputKeyup = function(e) {
    this.notifyErrors = true;
    this.emit("inputchange", this, this.getRawValue());
    if (e.key.length === 1) {
      this.onKeyup(this, e.key, e);
      this.emit("keyup", this, e.key, e);
      e.stop();
    } else {
      this.onSpecialkeyup(this, e.key, e);
      this.emit("specialkeyup", this, e.key, e);
    }
    if (this.hasErrors()) {
      this.validateOnKeyUp = true;
      this.setValue(this.getRawValue(), true);
    }
    if (this.validateOnKeyUp) {
      this.setValue(this.getRawValue(), true);
      this.validate();
    }
  };

  BaseTextControl.prototype.onSpecialkey = function(control, key, e) {};

  BaseTextControl.prototype.onKeydown = function(control, key, e) {};

  BaseTextControl.prototype.onSpecialkeyup = function(control, key, e) {};

  BaseTextControl.prototype.onKeyup = function(control, key, e) {};

  return BaseTextControl;

})(BaseInputControl);

module.exports = BaseTextControl;


},{"../../input/Text":80,"./BaseInputControl":26}],29:[function(require,module,exports){
var BaseControl, ButtonGroup, ButtonGroupControl,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

BaseControl = require('./BaseControl');

ButtonGroup = require('../../buttons/ButtonGroup');

ButtonGroupControl = (function(_super) {
  __extends(ButtonGroupControl, _super);

  function ButtonGroupControl() {
    return ButtonGroupControl.__super__.constructor.apply(this, arguments);
  }

  ButtonGroupControl.prototype.xtype = "buttongroupfield";

  ButtonGroupControl.prototype.items = null;

  ButtonGroupControl.prototype.toggle = 'radio';

  ButtonGroupControl.prototype.setValue = function(value) {
    var v, _i, _len;
    ButtonGroupControl.__super__.setValue.call(this, value);
    if (this.input.toggle === 'radio') {
      this.input.setActive(value, true, true);
    } else {
      this.input.setActiveAll(false, true);
      if (Type.isArray(value)) {
        for (_i = 0, _len = value.length; _i < _len; _i++) {
          v = value[_i];
          this.input.setActive(v, true, true);
        }
      } else {
        this.input.setActive(value, true, true);
      }
    }
  };

  ButtonGroupControl.prototype.createInput = function() {
    return new ButtonGroup({
      toggle: this.toggle
    });
  };

  ButtonGroupControl.prototype.setItems = function(items) {
    var name, text;
    this.input.removeComponents();
    for (name in items) {
      text = items[name];
      this.input.addButton(name, {
        text: text
      });
    }
  };

  ButtonGroupControl.prototype.afterRenderControl = function() {
    this.setItems(this.items);
    this.input.on('active', (function(_this) {
      return function() {
        var value;
        value = [];
        _this.input.getActiveButtons().each(function(btn) {
          return value.push(btn.name);
        });
        return _this.setValue(value);
      };
    })(this));
  };

  return ButtonGroupControl;

})(BaseControl);

module.exports = ButtonGroupControl;


},{"../../buttons/ButtonGroup":7,"./BaseControl":25}],30:[function(require,module,exports){
var Button, ButtonControl, ResetButton, SubmitButton,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Button = require('../../buttons/Button');

ButtonControl = (function(_super) {
  __extends(ButtonControl, _super);

  function ButtonControl(config) {
    if (config == null) {
      config = {};
    }
    if (config.label) {
      config.text = config.label;
    }
    ButtonControl.__super__.constructor.call(this, config);
  }

  return ButtonControl;

})(Button);

SubmitButton = (function(_super) {
  __extends(SubmitButton, _super);

  function SubmitButton() {
    return SubmitButton.__super__.constructor.apply(this, arguments);
  }

  SubmitButton.prototype.isSubmitButton = true;

  SubmitButton.prototype.xtype = 'submitbutton';

  SubmitButton.prototype.type = 'primary';

  return SubmitButton;

})(ButtonControl);

ResetButton = (function(_super) {
  __extends(ResetButton, _super);

  function ResetButton() {
    return ResetButton.__super__.constructor.apply(this, arguments);
  }

  ResetButton.prototype.isResetButton = true;

  ResetButton.prototype.xtype = 'submitbutton';

  return ResetButton;

})(ButtonControl);

module.exports = {
  ButtonControl: ButtonControl,
  SubmitButton: SubmitButton,
  ResetButton: ResetButton
};


},{"../../buttons/Button":6}],31:[function(require,module,exports){
var BaseInputControl, Checkbox, CheckboxControl,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

BaseInputControl = require('./BaseInputControl');

Checkbox = require('../../input/Checkbox');

CheckboxControl = (function(_super) {
  __extends(CheckboxControl, _super);

  function CheckboxControl() {
    return CheckboxControl.__super__.constructor.apply(this, arguments);
  }

  CheckboxControl.prototype.xtype = "checkbox";

  CheckboxControl.prototype.value = false;

  CheckboxControl.prototype.isBoxControl = true;

  CheckboxControl.prototype.createInput = function() {
    var checkbox;
    checkbox = new Checkbox({
      id: this.id + 'Input',
      label: this.label
    });
    checkbox.on('change', (function(_this) {
      return function() {
        _this.setValue(!_this.getValue());
      };
    })(this));
    return checkbox;
  };

  CheckboxControl.prototype.isChecked = function() {
    return this.value === true;
  };

  CheckboxControl.prototype.isFilled = function() {
    return this.isChecked();
  };

  CheckboxControl.prototype.renderLabel = function() {};

  CheckboxControl.prototype.renderControl = function(ct) {
    var input;
    ct.addClass('input-control');
    input = this.getInput();
    input.render(ct);
  };

  return CheckboxControl;

})(BaseInputControl);

module.exports = CheckboxControl;


},{"../../input/Checkbox":68,"./BaseInputControl":26}],32:[function(require,module,exports){
var BaseControl, CheckboxList, CheckboxListControl, Helpers,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

BaseControl = require('./BaseControl');

CheckboxList = require('../../input/CheckboxList');

Helpers = require('./Helpers');

CheckboxListControl = (function(_super) {
  __extends(CheckboxListControl, _super);

  function CheckboxListControl() {
    return CheckboxListControl.__super__.constructor.apply(this, arguments);
  }

  CheckboxListControl.prototype.xtype = "checkboxlist";

  CheckboxListControl.prototype.items = null;

  CheckboxListControl.prototype.inline = false;

  CheckboxListControl.prototype.isBoxControl = true;

  CheckboxListControl.prototype.createInput = function() {
    return new CheckboxList({
      id: this.id + '-input',
      inline: this.inline
    });
  };

  CheckboxListControl.prototype.getItems = function() {
    return Helpers.createInputItems(this);
  };

  CheckboxListControl.prototype.setItems = function(items) {
    Helpers.setInputItems(this, items);
  };

  CheckboxListControl.prototype.setValue = function(value) {
    this.input.setValue(value);
    CheckboxListControl.__super__.setValue.call(this, value);
  };

  CheckboxListControl.prototype.setDisabled = function(disabled) {
    this.input.setDisabled(disabled);
    CheckboxListControl.__super__.setDisabled.call(this, disabled);
  };

  CheckboxListControl.prototype.setDisabledItem = function(name, disabled) {
    this.input.setDisabled(name, disabled);
  };

  CheckboxListControl.prototype.renderControl = function(ct) {
    this.getInput().render(ct);
  };

  CheckboxListControl.prototype.afterRenderControl = function() {
    this.setItems(this.getItems());
    this.input.setValue(this.value);
    this.input.setDisabled(this.disabled);
    this.input.on('change', (function(_this) {
      return function() {
        return _this.setValue(_this.input.getValue());
      };
    })(this));
    this.input.on('blur', (function(_this) {
      return function() {
        return _this.validate();
      };
    })(this));
  };

  return CheckboxListControl;

})(BaseControl);

module.exports = CheckboxListControl;


},{"../../input/CheckboxList":69,"./BaseControl":25,"./Helpers":38}],33:[function(require,module,exports){
var BaseInputControl, ColorControl, ColorInput,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

BaseInputControl = require('./BaseInputControl');

ColorInput = require('../../input/Color');

ColorControl = (function(_super) {
  __extends(ColorControl, _super);

  function ColorControl() {
    return ColorControl.__super__.constructor.apply(this, arguments);
  }

  ColorControl.prototype.xtype = 'colorfield';

  ColorControl.prototype.readonly = false;

  ColorControl.prototype.resettable = false;

  ColorControl.prototype.doInit = function() {
    ColorControl.__super__.doInit.apply(this, arguments);
    if (this.value) {
      this.value = this.value.toLowerCase();
    }
  };

  ColorControl.prototype.setValue = function(value) {
    if (value) {
      value = value.toLowerCase();
    }
    ColorControl.__super__.setValue.call(this, value);
    return this;
  };

  ColorControl.prototype.createInput = function() {
    var input;
    input = new ColorInput({
      id: this.id + 'Input',
      disabled: this.disabled,
      readonly: this.readonly
    });
    input.on('changed', (function(_this) {
      return function(input, value) {
        _this.emit('inputchange', _this, value);
      };
    })(this));
    input.on('selected', (function(_this) {
      return function(input, value) {
        _this.setValue(value);
      };
    })(this));
    input.on('reset', (function(_this) {
      return function() {
        _this.reset();
      };
    })(this));
    return input;
  };

  ColorControl.prototype.onDirtyChange = function(isDirty) {
    ColorControl.__super__.onDirtyChange.call(this, isDirty);
    if (this.resettable) {
      this.input.setResettable(isDirty);
    }
  };

  ColorControl.prototype.initRules = function() {
    ColorControl.__super__.initRules.call(this);
    this.rules.addRule("color");
  };

  return ColorControl;

})(BaseInputControl);

module.exports = ColorControl;


},{"../../input/Color":70,"./BaseInputControl":26}],34:[function(require,module,exports){
var BaseSelectControl, Combo, ComboControl,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

BaseSelectControl = require('./BaseSelectControl');

Combo = require('../../input/Combo');

ComboControl = (function(_super) {
  __extends(ComboControl, _super);

  function ComboControl() {
    return ComboControl.__super__.constructor.apply(this, arguments);
  }

  ComboControl.prototype.xtype = 'combobox';

  ComboControl.prototype.hideSelected = false;

  ComboControl.prototype.multiple = false;

  ComboControl.prototype.height = null;

  ComboControl.prototype.placeholder = '';

  ComboControl.prototype.prompt = false;

  ComboControl.prototype.createInput = function() {
    return new Combo({
      id: this.id + 'Input',
      hideSelected: this.hideSelected,
      multiple: this.multiple,
      height: this.height,
      placeholder: this.placeholder,
      prompt: this.prompt
    });
  };

  return ComboControl;

})(BaseSelectControl);

module.exports = ComboControl;


},{"../../input/Combo":71,"./BaseSelectControl":27}],35:[function(require,module,exports){
var DateControl, DateInput, TextControl,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

TextControl = require('./Text');

DateInput = require('../../input/Date');

DateControl = (function(_super) {
  __extends(DateControl, _super);

  function DateControl() {
    return DateControl.__super__.constructor.apply(this, arguments);
  }

  DateControl.prototype.xtype = "datefield";

  DateControl.prototype.type = 'date';

  DateControl.prototype.validateOnChange = false;

  DateControl.prototype.startDate = null;

  DateControl.prototype.endDate = null;

  DateControl.prototype.pickerBtn = false;

  DateControl.prototype.todayBtn = false;

  DateControl.prototype.clearBtn = false;

  DateControl.prototype.resettable = false;

  DateControl.prototype.editable = false;

  DateControl.prototype.resetBtn = null;

  DateControl.prototype.afterInit = function() {
    DateControl.__super__.afterInit.apply(this, arguments);
    this.append = '<span class="glyphicon glyphicon-calendar"></span>';
    if (this.resettable) {
      this.addResetButton();
    }
  };

  DateControl.prototype.onDirtyChange = function(isDirty) {
    if (this.resettable) {
      this.getButton('reset').setDisabled(!isDirty);
    }
  };

  DateControl.prototype.createInput = function() {
    var input;
    input = new DateInput({
      id: this.id + '-input',
      name: this.name,
      type: this.type,
      disabled: this.disabled,
      readonly: this.readonly,
      placeholder: 'yyyy-mm-dd',
      startDate: this.startDate,
      endDate: this.endDate,
      todayBtn: this.todayBtn || this.pickerBtn,
      clearBtn: this.clearBtn || this.pickerBtn
    });
    input.on('changed', (function(_this) {
      return function(picker, value) {
        _this.setValue(value);
      };
    })(this));
    input.on('reset', (function(_this) {
      return function() {
        _this.reset();
      };
    })(this));
    return input;
  };

  DateControl.prototype.initRules = function() {
    DateControl.__super__.initRules.apply(this, arguments);
    this.rules.addRule("date");
  };

  DateControl.prototype.afterRenderControl = function() {
    DateControl.__super__.afterRenderControl.apply(this, arguments);
    this.getElement('.glyphicon-calendar').getParent().setStyle('cursor', 'pointer').on('click', (function(_this) {
      return function() {
        return _this.getInput().openPicker();
      };
    })(this));
  };

  return DateControl;

})(TextControl);

module.exports = DateControl;


},{"../../input/Date":73,"./Text":43}],36:[function(require,module,exports){
var BaseControl, DateRangeControl, DateRangeInput,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

BaseControl = require('./BaseControl');

DateRangeInput = require('../../input/DateRange');

DateRangeControl = (function(_super) {
  __extends(DateRangeControl, _super);

  function DateRangeControl() {
    return DateRangeControl.__super__.constructor.apply(this, arguments);
  }

  DateRangeControl.prototype.xtype = "daterange";

  DateRangeControl.prototype.readonly = false;

  DateRangeControl.prototype.startDate = null;

  DateRangeControl.prototype.endDate = null;

  DateRangeControl.prototype.pickerBtn = false;

  DateRangeControl.prototype.todayBtn = false;

  DateRangeControl.prototype.clearBtn = false;

  DateRangeControl.prototype.resettable = false;

  DateRangeControl.prototype.editable = false;

  DateRangeControl.prototype.afterInit = function() {
    DateRangeControl.__super__.afterInit.apply(this, arguments);
    if (this.resettable) {
      this.addResetButton();
    }
  };

  DateRangeControl.prototype.onDirtyChange = function(isDirty) {
    if (this.resettable) {
      this.getButton('reset').setDisabled(!isDirty);
    }
  };

  DateRangeControl.prototype.createInput = function() {
    var input;
    input = new DateRangeInput({
      id: this.id + '-input',
      name: this.name,
      disabled: this.disabled,
      readonly: this.readonly,
      startDate: this.startDate,
      endDate: this.endDate,
      todayBtn: this.todayBtn || this.pickerBtn,
      clearBtn: this.clearBtn || this.pickerBtn
    });
    input.on('changed', (function(_this) {
      return function(picker, value) {
        _this.setValue(value);
      };
    })(this));
    return input;
  };

  DateRangeControl.prototype.setValue = function(value) {
    this.input.setValue(value);
    DateRangeControl.__super__.setValue.call(this, value);
  };

  DateRangeControl.prototype.setDisabled = function(disabled) {
    this.input.setDisabled(disabled);
    DateRangeControl.__super__.setDisabled.call(this, disabled);
  };

  DateRangeControl.prototype.afterRenderControl = function() {
    DateRangeControl.__super__.afterRenderControl.apply(this, arguments);
    if (this.resettable) {
      this.input.el.addClass('has-append');
    }
  };

  return DateRangeControl;

})(BaseControl);

module.exports = DateRangeControl;


},{"../../input/DateRange":74,"./BaseControl":25}],37:[function(require,module,exports){
var BaseControl, DropSelectControl, DropSelectInput,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

BaseControl = require('./BaseControl');

DropSelectInput = require('../../input/DropSelect');

DropSelectControl = (function(_super) {
  __extends(DropSelectControl, _super);

  function DropSelectControl() {
    return DropSelectControl.__super__.constructor.apply(this, arguments);
  }

  DropSelectControl.prototype.xtype = "dropselect";

  DropSelectControl.prototype.store = void 0;

  DropSelectControl.prototype.keyProperty = void 0;

  DropSelectControl.prototype.textProperty = void 0;

  DropSelectControl.prototype.sourceTitle = void 0;

  DropSelectControl.prototype.targetTitle = void 0;

  DropSelectControl.prototype.sourceEmpty = void 0;

  DropSelectControl.prototype.targetEmpty = void 0;

  DropSelectControl.prototype.createInput = function() {
    return new DropSelectInput({
      id: this.id + '-input',
      store: this.store,
      keyProperty: this.keyProperty,
      textProperty: this.textProperty,
      sourceTitle: this.sourceTitle,
      targetTitle: this.targetTitle,
      sourceEmpty: this.sourceEmpty,
      targetEmpty: this.targetEmpty
    });
  };

  DropSelectControl.prototype.setValue = function(value) {
    this.input.setValue(value, true);
    DropSelectControl.__super__.setValue.call(this, value);
  };

  DropSelectControl.prototype.setDisabled = function(disabled) {
    this.input.setDisabled(disabled);
    DropSelectControl.__super__.setDisabled.call(this, disabled);
  };

  DropSelectControl.prototype.renderControl = function(ct) {
    this.getInput().render(ct);
  };

  DropSelectControl.prototype.afterRenderControl = function() {
    this.input.setValue(this.value);
    this.input.setDisabled(this.disabled);
    this.input.on('change', (function(_this) {
      return function() {
        return _this.setValue(_this.input.getValue());
      };
    })(this));
  };

  return DropSelectControl;

})(BaseControl);

module.exports = DropSelectControl;


},{"../../input/DropSelect":75,"./BaseControl":25}],38:[function(require,module,exports){
var Helpers;

Helpers = (function() {
  function Helpers() {}

  Helpers.createSelectItems = function(control) {
    var items;
    if (control.items) {
      return control.items;
    } else if (control.store) {
      control.store = miwo.store(control.store);
      if (!control.keyProperty) {
        control.keyProperty = 'id';
      }
      if (!control.textProperty) {
        throw new Error("Undefined text property");
      }
      items = {};
      control.store.each((function(_this) {
        return function(row) {
          return items[row.get(control.keyProperty)] = {
            text: row.get(control.textProperty),
            content: control.buildRowContent(row)
          };
        };
      })(this));
      return items;
    } else {
      return {};
    }
  };

  Helpers.setSelectItems = function(control, items) {
    var group, iname, input, ivalue, name, value, _i, _len, _ref;
    if (!control.input) {
      return;
    }
    input = control.input;
    input.clear();
    if (control.prompt && control.requirePromptItem) {
      input.addOption("", control.prompt);
    }
    if (Type.isArray(items)) {
      for (_i = 0, _len = items.length; _i < _len; _i++) {
        value = items[_i];
        input.addOption(value, value);
      }
    } else {
      for (name in items) {
        value = items[name];
        if (Type.isObject(value)) {
          if (value.items) {
            group = input.addGroup(value.title);
            _ref = value.items;
            for (iname in _ref) {
              ivalue = _ref[iname];
              if (Type.isObject(ivalue)) {
                group.addOption(iname, ivalue.text, ivalue.content);
              } else {
                group.addOption(iname, ivalue);
              }
            }
          } else {
            input.addOption(name, value.text, value.content);
          }
        } else {
          input.addOption(name, value);
        }
      }
    }
  };

  Helpers.createInputItems = function(control) {
    var items;
    if (control.items) {
      return control.items;
    } else if (control.store) {
      control.store = miwo.store(control.store);
      if (!control.keyProperty) {
        control.keyProperty = 'id';
      }
      if (!control.textProperty) {
        throw new Error("Undefined text property");
      }
      items = {};
      control.store.each((function(_this) {
        return function(row) {
          return items[row.get(control.keyProperty)] = {
            text: row.get(control.textProperty),
            content: control.buildRowContent(row)
          };
        };
      })(this));
      return items;
    } else {
      return {};
    }
  };

  Helpers.setInputItems = function(control, items) {
    var input, name, value, _i, _len;
    if (!control.input) {
      return;
    }
    input = control.input;
    input.clear();
    if (Type.isArray(items)) {
      for (_i = 0, _len = items.length; _i < _len; _i++) {
        value = items[_i];
        input.addItem(value, value);
      }
    } else {
      for (name in items) {
        value = items[name];
        input.addItem(name, value);
      }
    }
  };

  return Helpers;

})();

module.exports = Helpers;


},{}],39:[function(require,module,exports){
var NumberControl, TextControl,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

TextControl = require('./Text');

NumberControl = (function(_super) {
  __extends(NumberControl, _super);

  function NumberControl() {
    return NumberControl.__super__.constructor.apply(this, arguments);
  }

  NumberControl.prototype.xtype = "numberfield";

  NumberControl.prototype.type = 'number';

  NumberControl.prototype.min = null;

  NumberControl.prototype.max = null;

  NumberControl.prototype.pattern = /[\d\.\-]/;

  NumberControl.prototype.setValue = function(value) {
    if (this.min !== null && value < this.min) {
      value = this.min;
    }
    if (this.max !== null && value > this.max) {
      value = this.max;
    }
    NumberControl.__super__.setValue.call(this, value);
  };

  NumberControl.prototype.initRules = function() {
    NumberControl.__super__.initRules.call(this);
    this.rules.addRule("number");
    if (this.min !== null) {
      this.rules.addRule("min", null, this.min);
    }
    if (this.max !== null) {
      this.rules.addRule("max", null, this.max);
    }
  };

  NumberControl.prototype.createInput = function() {
    var input;
    input = NumberControl.__super__.createInput.call(this);
    input.el.addClass("number");
    if (this.min !== null) {
      input.el.set("min", this.min);
    }
    if (this.max !== null) {
      input.el.set("max", this.max);
    }
    return input;
  };

  return NumberControl;

})(TextControl);

module.exports = NumberControl;


},{"./Text":43}],40:[function(require,module,exports){
var BaseControl, Helpers, RadioList, RadioListControl,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

BaseControl = require('./BaseControl');

RadioList = require('../../input/RadioList');

Helpers = require('./Helpers');

RadioListControl = (function(_super) {
  __extends(RadioListControl, _super);

  function RadioListControl() {
    return RadioListControl.__super__.constructor.apply(this, arguments);
  }

  RadioListControl.prototype.xtype = "radiolist";

  RadioListControl.prototype.items = null;

  RadioListControl.prototype.inline = false;

  RadioListControl.prototype.isBoxControl = true;

  RadioListControl.prototype.createInput = function() {
    return new RadioList({
      id: this.id + '-input',
      inline: this.inline,
      radioName: this.name
    });
  };

  RadioListControl.prototype.getItems = function() {
    return Helpers.createInputItems(this);
  };

  RadioListControl.prototype.setItems = function(items) {
    Helpers.setInputItems(this, items);
  };

  RadioListControl.prototype.setValue = function(value) {
    this.input.setValue(value);
    RadioListControl.__super__.setValue.call(this, value);
  };

  RadioListControl.prototype.setDisabled = function(disabled) {
    this.input.setDisabled(disabled);
    RadioListControl.__super__.setDisabled.call(this, disabled);
  };

  RadioListControl.prototype.setDisabledItem = function(name, disabled) {
    this.input.setDisabled(name, disabled);
  };

  RadioListControl.prototype.renderControl = function(ct) {
    this.getInput().render(ct);
  };

  RadioListControl.prototype.afterRenderControl = function() {
    this.setItems(this.getItems());
    this.input.setValue(this.value);
    this.input.setDisabled(this.disabled);
    this.input.on('change', (function(_this) {
      return function() {
        return _this.setValue(_this.input.getValue());
      };
    })(this));
    this.input.on('blur', (function(_this) {
      return function() {
        return _this.validate();
      };
    })(this));
  };

  return RadioListControl;

})(BaseControl);

module.exports = RadioListControl;


},{"../../input/RadioList":77,"./BaseControl":25,"./Helpers":38}],41:[function(require,module,exports){
var BaseSelectControl, Select, SelectControl,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

BaseSelectControl = require('./BaseSelectControl');

Select = require('../../input/Select');

SelectControl = (function(_super) {
  __extends(SelectControl, _super);

  function SelectControl() {
    return SelectControl.__super__.constructor.apply(this, arguments);
  }

  SelectControl.prototype.xtype = 'selectbox';

  SelectControl.prototype.requirePromptItem = true;

  SelectControl.prototype.createInput = function() {
    return new Select({
      id: this.id + '-input'
    });
  };

  return SelectControl;

})(BaseSelectControl);

module.exports = SelectControl;


},{"../../input/Select":78,"./BaseSelectControl":27}],42:[function(require,module,exports){
var BaseInputControl, Slider, SliderControl,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

BaseInputControl = require('./BaseInputControl');

Slider = require('../../input/Slider');

SliderControl = (function(_super) {
  __extends(SliderControl, _super);

  function SliderControl() {
    return SliderControl.__super__.constructor.apply(this, arguments);
  }

  SliderControl.prototype.xtype = "slider";

  SliderControl.prototype.min = 0;

  SliderControl.prototype.max = 100;

  SliderControl.prototype.step = 1;

  SliderControl.prototype.value = 0;

  SliderControl.prototype.mode = 'slider';

  SliderControl.prototype.knobRenderer = void 0;

  SliderControl.prototype.selectionRenderer = void 0;

  SliderControl.prototype.setValue = function(value) {
    this.input.setValue(value);
    SliderControl.__super__.setValue.call(this, this.input.getValue());
  };

  SliderControl.prototype.createInput = function() {
    var input;
    input = new Slider({
      id: this.id + 'Input',
      mode: this.mode,
      inputName: this.name,
      step: this.step,
      min: this.min,
      max: this.max,
      knobRenderer: this.knobRenderer,
      selectionRenderer: this.selectionRenderer
    });
    input.on('change', (function(_this) {
      return function(slider, value) {
        _this.setValue(value);
      };
    })(this));
    input.on('slide', (function(_this) {
      return function(slider, value) {
        _this.emit('inputchange', _this, value);
      };
    })(this));
    return input;
  };

  return SliderControl;

})(BaseInputControl);

module.exports = SliderControl;


},{"../../input/Slider":79,"./BaseInputControl":26}],43:[function(require,module,exports){
var BaseTextControl, TextControl,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

BaseTextControl = require('./BaseTextControl');

TextControl = (function(_super) {
  __extends(TextControl, _super);

  function TextControl() {
    return TextControl.__super__.constructor.apply(this, arguments);
  }

  TextControl.prototype.isTextField = true;

  TextControl.prototype.xtype = 'textfield';

  TextControl.prototype.initRules = function() {
    TextControl.__super__.initRules.apply(this, arguments);
    switch (this.type) {
      case 'email':
        this.rules.addRule('email');
        break;
      case 'url':
        this.rules.addRule('url');
        break;
      case 'date':
        this.rules.addRule('date');
    }
  };

  TextControl.prototype.onSpecialkey = function(control, key, e) {
    if (key === 'enter') {
      this.setValue(this.getRawValue(), true);
    }
  };

  return TextControl;

})(BaseTextControl);

module.exports = TextControl;


},{"./BaseTextControl":28}],44:[function(require,module,exports){
var BaseTextControl, TextArea, TextAreaControl,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

BaseTextControl = require('./BaseTextControl');

TextArea = require('../../input/TextArea');

TextAreaControl = (function(_super) {
  __extends(TextAreaControl, _super);

  function TextAreaControl() {
    return TextAreaControl.__super__.constructor.apply(this, arguments);
  }

  TextAreaControl.prototype.xtype = "textarea";

  TextAreaControl.prototype.isTextAreaField = true;

  TextAreaControl.prototype.height = null;

  TextAreaControl.prototype.resize = "vertical";

  TextAreaControl.prototype.createInput = function() {
    var input;
    input = new TextArea({
      id: this.id + '-input',
      inputName: this.name,
      height: this.height,
      readonly: this.readonly,
      disabled: this.disabled,
      resize: this.resize,
      placeholder: this.placeholder
    });
    return input;
  };

  return TextAreaControl;

})(BaseTextControl);

module.exports = TextAreaControl;


},{"../../input/TextArea":81,"./BaseTextControl":28}],45:[function(require,module,exports){
var BaseControl, ToggleControl, ToggleInput,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

BaseControl = require('./BaseControl');

ToggleInput = require('../../input/Toggle');

ToggleControl = (function(_super) {
  __extends(ToggleControl, _super);

  function ToggleControl() {
    return ToggleControl.__super__.constructor.apply(this, arguments);
  }

  ToggleControl.prototype.xtype = 'toggle';

  ToggleControl.prototype.onState = void 0;

  ToggleControl.prototype.offState = void 0;

  ToggleControl.prototype.onText = void 0;

  ToggleControl.prototype.offText = void 0;

  ToggleControl.prototype.size = void 0;

  ToggleControl.prototype.value = false;

  ToggleControl.prototype.createInput = function() {
    return new ToggleInput({
      id: this.id + '-input',
      inputName: this.name,
      size: this.size,
      onState: this.onState,
      offState: this.offState,
      onText: this.onText,
      offText: this.offText
    });
  };

  ToggleControl.prototype.setValue = function(value) {
    this.input.setValue(value);
    ToggleControl.__super__.setValue.call(this, value);
  };

  ToggleControl.prototype.setDisabled = function(disabled) {
    this.input.setDisabled(disabled);
    ToggleControl.__super__.setDisabled.call(this, disabled);
  };

  ToggleControl.prototype.setReadonly = function(readonly) {
    this.input.setReadonly(readonly);
  };

  ToggleControl.prototype.renderControl = function(ct) {
    this.getInput().render(ct);
  };

  ToggleControl.prototype.afterRenderControl = function() {
    this.input.setValue(this.value);
    this.input.setDisabled(this.disabled);
    this.input.setReadonly(this.readonly);
    this.input.on('change', (function(_this) {
      return function() {
        return _this.setValue(_this.input.getValue());
      };
    })(this));
  };

  return ToggleControl;

})(BaseControl);

module.exports = ToggleControl;


},{"../../input/Toggle":82,"./BaseControl":25}],46:[function(require,module,exports){
var BaseContainer, exports;

exports = {
  container: {
    BaseContainer: require('./container/BaseContainer'),
    Fieldset: require('./container/Fieldset'),
    Form: require('./container/Form')
  },
  render: {
    FormRendererFactory: require('./render/FormRendererFactory'),
    DefaultRenderer: require('./render/DefaultRenderer'),
    InlineRenderer: require('./render/InlineRenderer')
  },
  control: {
    BaseControl: require('./control/BaseControl'),
    BaseInputControl: require('./control/BaseInputControl'),
    BaseTextControl: require('./control/BaseTextControl'),
    Checkbox: require('./control/Checkbox'),
    CheckboxList: require('./control/CheckboxList'),
    RadioList: require('./control/RadioList'),
    Select: require('./control/Select'),
    Combo: require('./control/Combo'),
    Color: require('./control/Color'),
    Date: require('./control/Date'),
    DateRange: require('./control/DateRange'),
    Number: require('./control/Number'),
    Slider: require('./control/Slider'),
    Text: require('./control/Text'),
    TextArea: require('./control/TextArea'),
    Toggle: require('./control/Toggle'),
    DropSelect: require('./control/DropSelect'),
    ButtonGroup: require('./control/ButtonGroup'),
    Button: require('./control/Buttons').ButtonControl,
    SubmitButton: require('./control/Buttons').SubmitButton,
    ResetButton: require('./control/Buttons').ResetButton
  }
};

BaseContainer = exports.container.BaseContainer;

BaseContainer.registerControl('container', BaseContainer);

BaseContainer.registerControl('date', exports.control.Date);

BaseContainer.registerControl('dateRange', exports.control.DateRange);

BaseContainer.registerControl('text', exports.control.Text);

BaseContainer.registerControl('textarea', exports.control.TextArea);

BaseContainer.registerControl('color', exports.control.Color);

BaseContainer.registerControl('number', exports.control.Number);

BaseContainer.registerControl('slider', exports.control.Slider);

BaseContainer.registerControl('combo', exports.control.Combo);

BaseContainer.registerControl('select', exports.control.Select);

BaseContainer.registerControl('checkbox', exports.control.Checkbox);

BaseContainer.registerControl('checkboxList', exports.control.CheckboxList);

BaseContainer.registerControl('radioList', exports.control.RadioList);

BaseContainer.registerControl('toggle', exports.control.Toggle);

BaseContainer.registerControl('dropSelect', exports.control.DropSelect);

BaseContainer.registerControl('buttonGroup', exports.control.ButtonGroup);

BaseContainer.registerControl('button', exports.control.Button);

BaseContainer.registerControl('submit', exports.control.SubmitButton);

BaseContainer.registerControl('reset', exports.control.ResetButton);

module.exports = exports;


},{"./container/BaseContainer":22,"./container/Fieldset":23,"./container/Form":24,"./control/BaseControl":25,"./control/BaseInputControl":26,"./control/BaseTextControl":28,"./control/ButtonGroup":29,"./control/Buttons":30,"./control/Checkbox":31,"./control/CheckboxList":32,"./control/Color":33,"./control/Combo":34,"./control/Date":35,"./control/DateRange":36,"./control/DropSelect":37,"./control/Number":39,"./control/RadioList":40,"./control/Select":41,"./control/Slider":42,"./control/Text":43,"./control/TextArea":44,"./control/Toggle":45,"./render/DefaultRenderer":47,"./render/FormRendererFactory":48,"./render/InlineRenderer":49}],47:[function(require,module,exports){
var DefaultRenderer,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

DefaultRenderer = (function(_super) {
  __extends(DefaultRenderer, _super);

  function DefaultRenderer() {
    return DefaultRenderer.__super__.constructor.apply(this, arguments);
  }

  DefaultRenderer.prototype.formCls = 'horizontal';

  DefaultRenderer.prototype.baseColSize = 8;

  DefaultRenderer.prototype.renderForm = function(form) {
    var username;
    if (this.formCls) {
      form.el.addClass('form-' + this.formCls);
    }
    if (form.preventAutoLogin) {
      username = new Element('input', {
        name: '_username',
        styles: {
          display: 'none'
        }
      });
      username.inject(form.el);
      username = new Element('input', {
        name: '_password',
        type: 'password',
        styles: {
          display: 'none'
        }
      });
      username.inject(form.el);
    }
  };

  DefaultRenderer.prototype.renderButtons = function(buttons, ct) {
    var button, _i, _len;
    ct.addClass('form-actions');
    if (ct.generated && this.baseColSize) {
      ct.addClass("col-sm-offset-" + (12 - this.baseColSize));
      ct.addClass("col-sm-" + this.baseColSize);
    }
    for (_i = 0, _len = buttons.length; _i < _len; _i++) {
      button = buttons[_i];
      button.render(ct);
    }
  };

  DefaultRenderer.prototype.renderGroup = function(control, ct) {
    if (!control.groupEl) {
      control.groupEl = control.el;
      control.groupEl.inject(ct);
      control.groupEl.addClass('form-group');
    }
    if (!control.visible) {
      control.groupEl.setVisible(false);
    }
    control.el = control.groupEl;
    if (!control.labelRendered) {
      this.renderLabel(control, control.groupEl);
    }
    if (!control.controlsRendered) {
      this.renderControls(control, control.groupEl);
    } else if (!control.controlRendered) {
      this.renderControl(control, control.controlsEl);
    } else if (!control.inputRendered) {
      control.getInput().replace(control.inputEl);
    }
  };

  DefaultRenderer.prototype.renderLabel = function(control, ct) {
    var labelEl;
    labelEl = control.renderLabel(ct);
    if (labelEl) {
      labelEl.addClass('control-label');
      if (this.baseColSize) {
        labelEl.addClass('col-sm-' + (12 - this.baseColSize));
      }
    }
  };

  DefaultRenderer.prototype.renderControls = function(control, ct) {
    var controlsEl, descEl, helpEl;
    if (!control.controlsEl) {
      controlsEl = new Element('div');
      controlsEl.inject(ct);
      controlsEl.addClass('form-controls');
      if (this.baseColSize) {
        controlsEl.addClass('col-sm-' + this.baseColSize);
      }
      control.controlsEl = controlsEl;
    }
    controlsEl = control.controlsEl;
    if (!controlsEl.getPrevious('.control-label') && this.baseColSize) {
      controlsEl.addClass('col-sm-offset-' + (12 - this.baseColSize));
    }
    if (control.help) {
      helpEl = new Element("span", {
        parent: controlsEl,
        cls: "help-block",
        html: control.help
      });
      control.helpEl = helpEl;
    }
    this.renderControl(control, controlsEl);
    if (control.desc) {
      descEl = new Element("div", {
        parent: controlsEl,
        cls: "help-block",
        html: control.desc
      });
      control.descEl = descEl;
    }
  };

  DefaultRenderer.prototype.renderControl = function(control, ct) {
    var inputCt;
    if (!control.controlEl) {
      inputCt = new Element('div');
      inputCt.inject(ct);
      control.controlEl = inputCt;
    }
    control.renderControl(control.controlEl);
  };

  return DefaultRenderer;

})(Miwo.Object);

module.exports = DefaultRenderer;


},{}],48:[function(require,module,exports){
var FormRendererFactory;

FormRendererFactory = (function() {
  FormRendererFactory.prototype.defines = null;

  function FormRendererFactory() {
    this.defines = {};
  }

  FormRendererFactory.prototype.register = function(name, fn) {
    this.defines[name] = fn;
  };

  FormRendererFactory.prototype.create = function(type, options) {
    if (!this.defines[type]) {
      throw new Error("Required form renderer '" + type + "' is not registered in FormRendererFactory");
    }
    return new this.defines[type](options);
  };

  return FormRendererFactory;

})();

module.exports = FormRendererFactory;


},{}],49:[function(require,module,exports){
var InlineRenderer;

InlineRenderer = (function() {
  InlineRenderer.prototype.options = null;

  function InlineRenderer() {
    this.options = {};
  }

  InlineRenderer.prototype.renderForm = function(form) {
    form.el.addClass('form-inline');
  };

  InlineRenderer.prototype.renderButtons = function(buttons, ct) {
    var button, _i, _len;
    for (_i = 0, _len = buttons.length; _i < _len; _i++) {
      button = buttons[_i];
      button.render(ct);
    }
  };

  InlineRenderer.prototype.renderGroup = function(control, ct) {
    if (!control.groupEl) {
      control.groupEl = control.el;
      control.groupEl.inject(ct);
      control.groupEl.addClass('form-group');
    }
    if (control.isBoxControl) {
      control.groupEl.addClass('margin-no');
    }
    if (!control.labelRendered) {
      this.renderLabel(control, control.groupEl);
    }
    if (!control.controlsRendered) {
      this.renderControls(control, control.groupEl);
    } else if (!control.controlRendered) {
      this.renderControl(control, control.controlsEl);
    } else if (!control.inputRendered) {
      control.getInput().replace(control.inputEl);
    }
  };

  InlineRenderer.prototype.renderLabel = function(control, ct) {
    var labelEl;
    labelEl = control.renderLabel(ct);
    if (labelEl) {
      labelEl.addClass('sr-only');
    }
  };

  InlineRenderer.prototype.renderControls = function(control, ct) {
    var controlsEl;
    if (!control.controlsEl) {
      controlsEl = new Element('div');
      controlsEl.inject(ct);
      controlsEl.addClass('form-controls');
      control.controlsEl = controlsEl;
    }
    this.renderControl(control, control.controlsEl);
  };

  InlineRenderer.prototype.renderControl = function(control, ct) {
    var inputCt;
    if (!control.controlEl) {
      inputCt = new Element('div');
      inputCt.inject(ct);
      control.controlEl = inputCt;
    }
    control.renderControl(control.controlEl);
  };

  return InlineRenderer;

})();

module.exports = InlineRenderer;


},{}],50:[function(require,module,exports){
var Action,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Action = (function(_super) {
  __extends(Action, _super);

  function Action() {
    return Action.__super__.constructor.apply(this, arguments);
  }

  Action.prototype.name = null;

  Action.prototype.text = null;

  Action.prototype.callback = null;

  Action.prototype.inline = false;

  Action.prototype.confirm = false;

  Action.prototype.confirmPlacement = null;

  Action.prototype.divider = false;

  return Action;

})(Miwo.Object);

module.exports = Action;


},{}],51:[function(require,module,exports){
var ActionColumn, CheckerColumn, Grid, GridRenderer, Operations, Paginator, Pane, SelectionModel,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

SelectionModel = require('../selection/SelectionModel');

GridRenderer = require('./renderer/GridRenderer');

CheckerColumn = require('./column/CheckerColumn');

ActionColumn = require('./column/ActionColumn');

Operations = require('./Operations');

Paginator = require('../pagination/Paginator');

Pane = require('../panel/Pane');

Grid = (function(_super) {
  __extends(Grid, _super);

  function Grid() {
    return Grid.__super__.constructor.apply(this, arguments);
  }

  Grid.prototype.isGrid = true;

  Grid.prototype.xtype = 'grid';

  Grid.prototype.condensed = false;

  Grid.prototype.stripe = false;

  Grid.prototype.nowrap = true;

  Grid.prototype.rowclickable = false;

  Grid.prototype.maskOnLoad = false;

  Grid.prototype.verticalAlign = null;

  Grid.prototype.store = null;

  Grid.prototype.renderer = null;

  Grid.prototype.selectable = false;

  Grid.prototype.selector = "auto";

  Grid.prototype.selection = "multi";

  Grid.prototype.groupBy = null;

  Grid.prototype.paginator = false;

  Grid.prototype.actionBtnSize = null;

  Grid.prototype.role = 'grid';

  Grid.prototype.size = 'md';

  Grid.prototype.layout = false;

  Grid.prototype.baseCls = "grid";

  Grid.prototype.checker = null;

  Grid.prototype.operations = null;

  Grid.prototype.selectionModel = null;

  Grid.prototype.headerEl = null;

  Grid.prototype.bodyEl = null;

  Grid.prototype.footerEl = null;

  Grid.prototype.lastAddedColumn = null;

  Grid.prototype.actionColumnIndex = 0;

  Grid.registerColumn = function(columnName, fn) {
    var addMethod;
    if (!fn) {
      throw new Error("Error in registry control " + controlName + ", constructor is undefined");
    }
    addMethod = 'add' + columnName.capitalize();
    this.prototype[addMethod] = function(name, config) {
      if (config == null) {
        config = {};
      }
      return this.addColumn(name, new fn(config));
    };
  };

  Grid.prototype.afterInit = function() {
    var contentEl;
    Grid.__super__.afterInit.apply(this, arguments);
    if (this.maskOnLoad) {
      this.showMask();
    }
    if (this.store) {
      if (Type.isString(this.store)) {
        this.setStore(miwo.store(this.store));
      } else {
        this.setStore(this.store);
      }
    }
    if (this.renderer) {
      this.rendererOptions = this.renderer;
      this.renderer = null;
    }
    contentEl = this.getContentEl();
    contentEl.addClass(this.getBaseCls('container'));
    this.headerEl = new Element("div", {
      parent: contentEl,
      cls: this.getBaseCls("header")
    });
    this.mainEl = new Element("div", {
      parent: contentEl,
      cls: this.getBaseCls("main")
    });
    this.bodyEl = new Element("div", {
      parent: this.mainEl,
      cls: this.getBaseCls("body")
    });
    this.footerEl = new Element("div", {
      parent: contentEl,
      cls: this.getBaseCls("footer")
    });
    this.contentEl = this.bodyEl;
    this.scrollableCt = this.mainEl;
    this.scrollableEl = this.bodyEl;
  };

  Grid.prototype.addedComponent = function(column) {
    this.lastAddedColumn = column;
  };

  Grid.prototype.addColumn = function(name, column) {
    if (!column.isColumn) {
      throw new Error("Object is not instance of column");
    }
    return this.add(name, column);
  };

  Grid.prototype.addCheckerColumn = function(name, config) {
    return this.addColumn(name, new CheckerColumn(config));
  };

  Grid.prototype.addActionColumn = function(name, config) {
    return this.addColumn(name, new ActionColumn(config));
  };

  Grid.prototype.addOperation = function(name, config) {
    return this.getOperations().addAction(name, config);
  };

  Grid.prototype.addAction = function(name, config) {
    return this.getActionColumn().addAction(name, config);
  };

  Grid.prototype.getActionColumn = function() {
    if (!this.lastAddedColumn.isActionColumn) {
      this.addActionColumn('actions' + this.actionColumnIndex);
      this.actionColumnIndex++;
    }
    return this.lastAddedColumn;
  };

  Grid.prototype.getOperations = function() {
    if (!this.operations) {
      this.operations = new Operations(this);
    }
    return this.operations;
  };

  Grid.prototype.getColumns = function() {
    return this.getComponents().toArray();
  };

  Grid.prototype.setSelectionModel = function(selectionModel) {
    this.selectionModel = selectionModel;
    if (!this.store) {
      throw new Error("Before set selection model, first set store");
    }
    this.selectionModel.setStore(this.store);
    this.mon(selectionModel, 'change', 'onSelectionModelChange');
  };

  Grid.prototype.getSelectionModel = function() {
    return this.selectionModel;
  };

  Grid.prototype.onSelectionModelChange = function(sm, selection) {
    this.emit('selectionchange', this, sm, selection);
  };

  Grid.prototype.setSelector = function(selector) {
    this.selector = selector;
    this.selector.setGrid(this);
    this.selector.setSelectionModel(this.getSelectionModel());
  };

  Grid.prototype.onOperationSubmit = function(action) {
    var records;
    records = this.getSelectionModel().getRecords();
    if (action.callback) {
      action.callback(records);
    }
    this.emit("action", this, action.name, records);
  };

  Grid.prototype.onActionSubmit = function(action, record) {
    if (action.callback) {
      action.callback(record);
    }
    this.emit("action", this, action.name, [record]);
  };

  Grid.prototype.showMask = function() {
    if (!this.loadMask) {
      this.loadMask = miwo.mask.create(this);
    }
    this.loadMask.show();
  };

  Grid.prototype.hideMask = function() {
    if (this.loadMask) {
      this.loadMask.hide();
    }
  };

  Grid.prototype.setStore = function(store) {
    this.munon(this.store, store, 'add', 'onStoreAdd');
    this.munon(this.store, store, 'remove', 'onStoreRemove');
    this.munon(this.store, store, 'refresh', 'onStoreRefresh');
    this.munon(this.store, store, 'update', 'onStoreUpdate');
    this.munon(this.store, store, 'beforeload', 'onStoreBeforeload');
    this.munon(this.store, store, 'load', 'onStoreLoad');
    this.munon(this.store, store, 'reload', 'onStoreReload');
    this.store = store;
  };

  Grid.prototype.getStore = function() {
    return this.store;
  };

  Grid.prototype.onStoreAdd = function(store, record) {
    if (this.rendered) {
      this.renderer.recordAdded(record);
    }
  };

  Grid.prototype.onStoreRemove = function(store, record) {
    if (this.rendered) {
      this.renderer.recordRemoved(record);
    }
  };

  Grid.prototype.onStoreUpdate = function(store, record) {
    if (this.rendered) {
      this.renderer.recordUpdated(record);
    }
  };

  Grid.prototype.setAutoSync = function(autoSync) {
    this.getRenderer().setAutoSync(autoSync);
  };

  Grid.prototype.onStoreRefresh = function() {
    this.refresh();
  };

  Grid.prototype.onStoreBeforeload = function() {
    if (this.loadMask && this.maskOnLoad) {
      this.loadMask.show();
    }
  };

  Grid.prototype.onStoreLoad = function() {
    this.refresh();
    if (this.loadMask) {
      this.loadMask.hide();
    }
  };

  Grid.prototype.onStoreReload = function() {
    this.refresh();
    if (this.loadMask) {
      this.loadMask.hide();
    }
  };

  Grid.prototype.refresh = function() {
    if (this.rendered) {
      this.renderer.refresh();
    }
  };

  Grid.prototype.sync = function() {
    if (this.rendered) {
      this.renderer.syncRows();
    }
  };

  Grid.prototype.getRecords = function() {
    return this.store.getRecords();
  };

  Grid.prototype.doRender = function() {
    var config, type;
    if (this.selectable || this.operations) {
      if (!this.selectionModel) {
        if (Type.isString(this.selection)) {
          config = {
            type: this.selection
          };
        } else {
          config = this.selection || {};
        }
        this.setSelectionModel(new SelectionModel(config));
      }
      if (!Type.isObject(this.selector) || !this.selector.isSelector) {
        if (Type.isString(this.selector)) {
          type = this.selector;
          config = null;
        } else {
          type = this.selector.type;
          config = this.selector;
        }
        if (type === 'auto') {
          type = this.operations ? 'check' : 'row';
        }
        this.setSelector(miwo.service('selectorFactory').create(type, config));
      }
      if (this.selector.checkerRequired) {
        this.checker = this.addCheckerColumn('checker');
      }
    }
    this.getRenderer().render();
  };

  Grid.prototype.afterRender = function() {
    Grid.__super__.afterRender.call(this);
    this.getRenderer().afterRender();
    if (this.store.loaded) {
      this.onRefresh();
    }
  };

  Grid.prototype.getRenderer = function() {
    if (!this.renderer) {
      this.renderer = this.createRenderer(this.rendererOptions);
    }
    return this.renderer;
  };

  Grid.prototype.createRenderer = function(options) {
    return new GridRenderer(this, options);
  };

  Grid.prototype.createComponentPaginator = function() {
    var config, paginator;
    config = this.paginator === true ? {} : this.paginator;
    paginator = new Paginator(config);
    if (this.store) {
      paginator.setStore(this.store);
    }
    return paginator;
  };

  Grid.prototype.onRefresh = function() {
    this.emit("refresh", this);
  };

  Grid.prototype.doDestroy = function() {
    if (this.renderer) {
      this.renderer.destroy();
    }
    if (this.selector) {
      this.selector.destroy();
    }
    if (this.selectionModel) {
      this.selectionModel.destroy();
    }
    this.selectionModel = null;
    this.renderer = null;
    this.selector = null;
    this.store = null;
    return Grid.__super__.doDestroy.apply(this, arguments);
  };

  return Grid;

})(Pane);

module.exports = Grid;


},{"../pagination/Paginator":94,"../panel/Pane":96,"../selection/SelectionModel":115,"./Operations":52,"./column/ActionColumn":53,"./column/CheckerColumn":55,"./renderer/GridRenderer":62}],52:[function(require,module,exports){
var Action, Button, Operations, PopoverSubmit, Select,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Action = require('./Action');

Button = require('../buttons/Button');

Select = require('../input/Select');

PopoverSubmit = require('./utils/PopoverSubmit');

Operations = (function(_super) {
  __extends(Operations, _super);

  Operations.prototype.componentCls = 'grid-operations';

  Operations.prototype.actions = null;

  Operations.prototype.select = null;

  Operations.prototype.submit = null;

  function Operations(grid, config) {
    this.grid = grid;
    Operations.__super__.constructor.call(this, config);
    this.actions = {};
  }

  Operations.prototype.addAction = function(name, config) {
    var action;
    action = new Action(config);
    action.name = name;
    this.actions[name] = action;
    return action;
  };

  Operations.prototype.doRender = function() {
    var action, name, _ref;
    this.select = new Select({
      id: this.id + '-operation'
    });
    this.select.render(this.el);
    _ref = this.actions;
    for (name in _ref) {
      action = _ref[name];
      this.select.addOption(action.name, action.text);
    }
    this.submit = new Button({
      text: miwo.tr("miwo.grid.execute"),
      handler: (function(_this) {
        return function() {
          action = _this.actions[_this.select.getValue()];
          _this.onOperationSubmit(action);
        };
      })(this)
    });
    this.submit.render(this.el);
  };

  Operations.prototype.onOperationSubmit = function(action) {
    if (!action.confirm) {
      this.grid.onOperationSubmit(action);
    } else {
      this.popover = new PopoverSubmit({
        renderTo: miwo.body,
        target: this.submit.el,
        title: miwo.tr("miwo.grid.confirm"),
        placement: action.confirmPlacement || 'top',
        onSubmit: (function(_this) {
          return function() {
            return _this.grid.onOperationSubmit(action);
          };
        })(this)
      });
      this.popover.show();
    }
  };

  return Operations;

})(Miwo.Component);

module.exports = Operations;


},{"../buttons/Button":6,"../input/Select":78,"./Action":50,"./utils/PopoverSubmit":64}],53:[function(require,module,exports){
var Action, ActionColumn, Button, Column, DropdownButton, PopoverSubmit,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Column = require('./Column');

Action = require('../Action');

Button = require('../../buttons/Button');

DropdownButton = require('../../buttons/DropdownButton');

PopoverSubmit = require('../utils/PopoverSubmit');

ActionColumn = (function(_super) {
  __extends(ActionColumn, _super);

  ActionColumn.prototype.xtype = 'actioncolumn';

  ActionColumn.prototype.actions = null;

  ActionColumn.prototype.align = 'right';

  ActionColumn.prototype.colCls = 'actions';

  ActionColumn.prototype.isActionColumn = true;

  ActionColumn.prototype.btnSize = null;

  ActionColumn.prototype.preventUpdateCell = true;

  ActionColumn.prototype.popover = null;

  ActionColumn.prototype.popoverCell = null;

  function ActionColumn() {
    this.actions = {};
  }

  ActionColumn.prototype.attachedContainer = function(grid) {
    if (!this.btnSize) {
      this.btnSize = grid.actionBtnSize || 'sm';
    }
  };

  ActionColumn.prototype.addAction = function(name, config) {
    var action;
    action = new Action(config);
    action.name = name;
    this.actions[name] = action;
    return action;
  };

  ActionColumn.prototype.removeAction = function(name) {
    delete this.actions[name];
    return this;
  };

  ActionColumn.prototype.onRenderCell = function(td, value, record, rowIndex) {
    var action, btn, buttons, inline, list, name, _i, _j, _len, _len1, _ref;
    inline = [];
    list = [];
    buttons = [];
    _ref = this.actions;
    for (name in _ref) {
      action = _ref[name];
      if (action.inline) {
        inline.push(action);
      } else {
        list.push(action);
      }
    }
    for (_i = 0, _len = inline.length; _i < _len; _i++) {
      action = inline[_i];
      btn = new Button({
        size: this.btnSize,
        name: action.name,
        text: action.text,
        handler: (function(_this) {
          return function(btn) {
            _this.onActionClick(_this.actions[btn.name], record, td, btn);
          };
        })(this)
      });
      btn.render(td);
      buttons.push(btn);
    }
    if (list.length > 0) {
      btn = new DropdownButton({
        size: this.btnSize
      });
      for (_j = 0, _len1 = list.length; _j < _len1; _j++) {
        action = list[_j];
        if (action.divider) {
          btn.addDivider();
        }
        btn.addItem(action.name, action.text, (function(_this) {
          return function(item) {
            _this.onActionClick(_this.actions[item.name], record, td, btn);
          };
        })(this));
      }
      btn.render(td);
      buttons.push(btn);
    }
    td.store('buttons', buttons);
  };

  ActionColumn.prototype.onDestroyCell = function(td) {
    var button, buttons, _i, _len;
    buttons = td.retrieve('buttons');
    for (_i = 0, _len = buttons.length; _i < _len; _i++) {
      button = buttons[_i];
      button.destroy();
    }
    td.eliminate('buttons');
    if (this.popoverCell && this.popoverCell === td) {
      this.closePopover();
    }
  };

  ActionColumn.prototype.onActionClick = function(action, record, td, btn) {
    if (!action.confirm) {
      this.getGrid().onActionSubmit(action, record);
    } else {
      this.closePopover();
      this.popover = new PopoverSubmit({
        renderTo: miwo.body,
        target: btn.el,
        title: miwo.tr("miwo.grid.confirm"),
        placement: action.confirmPlacement || 'left',
        onSubmit: (function(_this) {
          return function() {
            return _this.getGrid().onActionSubmit(action, record);
          };
        })(this),
        onCancel: (function(_this) {
          return function() {
            return _this.closePopover();
          };
        })(this)
      });
      this.popover.show();
      this.popoverCell = td;
    }
  };

  ActionColumn.prototype.closePopover = function() {
    if (!this.popover) {
      return;
    }
    this.popover.destroy();
    this.popover = null;
    this.popoverCell = null;
  };

  return ActionColumn;

})(Column);

module.exports = ActionColumn;


},{"../../buttons/Button":6,"../../buttons/DropdownButton":9,"../Action":50,"../utils/PopoverSubmit":64,"./Column":56}],54:[function(require,module,exports){
var CheckColumn, Column,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Column = require('./Column');

CheckColumn = (function(_super) {
  __extends(CheckColumn, _super);

  function CheckColumn() {
    return CheckColumn.__super__.constructor.apply(this, arguments);
  }

  CheckColumn.prototype.xtype = "checkcolumn";

  CheckColumn.prototype.align = "center";

  CheckColumn.prototype.width = 50;

  CheckColumn.prototype.iconTrue = "glyphicon glyphicon-ok";

  CheckColumn.prototype.iconFalse = "";

  CheckColumn.prototype.formatValue = function(value) {
    if (value) {
      return (this.iconTrue ? "<i class=\"" + this.iconTrue + "\"></i>" : "");
    } else {
      return (this.iconFalse ? "<i class=\"" + this.iconFalse + "\"></i>" : "");
    }
  };

  return CheckColumn;

})(Column);

module.exports = CheckColumn;


},{"./Column":56}],55:[function(require,module,exports){
var Checkbox, CheckerColumn, Column,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Column = require('./Column');

Checkbox = require('../../input/Checkbox');

CheckerColumn = (function(_super) {
  __extends(CheckerColumn, _super);

  function CheckerColumn() {
    return CheckerColumn.__super__.constructor.apply(this, arguments);
  }

  CheckerColumn.prototype.xtype = "checkercolumn";

  CheckerColumn.prototype.align = "center";

  CheckerColumn.prototype.width = 50;

  CheckerColumn.prototype.colCls = 'checker';

  CheckerColumn.prototype.isCheckerColumn = true;

  CheckerColumn.randId = 0;

  CheckerColumn.prototype.preventUpdateCell = true;

  CheckerColumn.prototype.onRenderCell = function(td, value, record) {
    var checkbox;
    checkbox = new Checkbox({
      id: this.getGrid().id.toString() + "-checker-" + (record.id || 'rnd' + (CheckerColumn.randId++))
    });
    checkbox.render(td);
    checkbox.on('change', (function(_this) {
      return function(checker, value) {
        _this.emit("rowcheck", _this, td.getParent('tr'), value);
      };
    })(this));
    td.set("disableclick", true);
    td.store('checker', checkbox);
  };

  CheckerColumn.prototype.onDestroyCell = function(td) {
    var checkbox;
    checkbox = td.retrieve('checker');
    checkbox.destroy();
    td.eliminate('checker');
  };

  CheckerColumn.prototype.onRenderHeader = function(th) {
    var checkbox;
    checkbox = new Checkbox({
      id: this.getGrid().id.toString() + '-checker-all'
    });
    checkbox.render(th);
    checkbox.on('change', (function(_this) {
      return function(checker, value) {
        _this.emit("headercheck", _this, value);
      };
    })(this));
    th.store('checker', checkbox);
  };

  CheckerColumn.prototype.getRowChecker = function(record) {
    var tr, _i, _len, _ref;
    _ref = this.getGrid().tbodyEl.getChildren();
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      tr = _ref[_i];
      if (tr.retrieve('record') === record) {
        return tr.getElement('td.grid-col-checker').retrieve('checker');
      }
    }
    return null;
  };

  CheckerColumn.prototype.getHeadChecker = function() {
    return this.getGrid().headerEl.getElement('tr:first-child th.grid-col-checker').retrieve('checker');
  };

  CheckerColumn.prototype.setCheckedRow = function(record, checked) {
    this.getRowChecker(record).setChecked(checked);
  };

  CheckerColumn.prototype.setDisabledRow = function(record, disabled) {
    this.getRowChecker(record).setDisabled(disabled);
  };

  CheckerColumn.prototype.setCheckedHeader = function(checked) {
    this.getHeadChecker().setChecked(checked);
  };

  return CheckerColumn;

})(Column);

module.exports = CheckerColumn;


},{"../../input/Checkbox":68,"./Column":56}],56:[function(require,module,exports){
var Column,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Column = (function(_super) {
  __extends(Column, _super);

  function Column() {
    return Column.__super__.constructor.apply(this, arguments);
  }

  Column.prototype.isColumn = true;

  Column.prototype.text = '';

  Column.prototype.title = '';

  Column.prototype.visible = true;

  Column.prototype.sortable = false;

  Column.prototype.renderer = null;

  Column.prototype.align = 'left';

  Column.prototype.emptyText = '';

  Column.prototype.widthType = 'auto';

  Column.prototype.width = null;

  Column.prototype.fit = null;

  Column.prototype.dataIndex = '';

  Column.prototype.titleIndex = null;

  Column.prototype.afterInit = function() {
    Column.__super__.afterInit.call(this);
    if (this.fit) {
      this.widthType = 'fit';
      delete this.fit;
    }
  };

  Column.prototype.getGrid = function() {
    return this.container;
  };

  Column.prototype.getDataIndex = function() {
    return this.dataIndex || this.name;
  };

  Column.prototype.renderHeader = function(value, record) {
    return this.text;
  };

  Column.prototype.renderValue = function(value, record) {
    var html;
    if (this.renderer) {
      html = this.renderer(value, record);
    } else {
      if (value === '' || value === void 0 || value === null) {
        html = this.emptyText;
      } else {
        html = this.formatValue(value, record);
      }
    }
    return html;
  };

  Column.prototype.formatValue = function(value, record) {
    return value;
  };

  Column.prototype.afterRender = function(renderer, grid) {};

  return Column;

})(Miwo.Component);

module.exports = Column;


},{}],57:[function(require,module,exports){
var Column, DateColumn,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Column = require('./Column');

DateColumn = (function(_super) {
  __extends(DateColumn, _super);

  function DateColumn() {
    return DateColumn.__super__.constructor.apply(this, arguments);
  }

  DateColumn.prototype.xtype = 'datecolumn';

  DateColumn.prototype.align = 'right';

  DateColumn.prototype.emptyText = 'N/A';

  DateColumn.prototype.format = '%c';

  DateColumn.prototype.formatValue = function(value, record) {
    if (Type.isDate(value)) {
      if (value.format) {
        return value.format(this.format);
      } else {
        return value.toDateString();
      }
    } else {
      return value;
    }
  };

  return DateColumn;

})(Column);

module.exports = DateColumn;


},{"./Column":56}],58:[function(require,module,exports){
var Column, NumberColumn,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Column = require('./Column');

NumberColumn = (function(_super) {
  __extends(NumberColumn, _super);

  function NumberColumn() {
    return NumberColumn.__super__.constructor.apply(this, arguments);
  }

  NumberColumn.prototype.xtype = 'numbercolumn';

  NumberColumn.prototype.align = 'right';

  return NumberColumn;

})(Column);

module.exports = NumberColumn;


},{"./Column":56}],59:[function(require,module,exports){
var Column, TextColumn,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Column = require('./Column');

TextColumn = (function(_super) {
  __extends(TextColumn, _super);

  function TextColumn() {
    return TextColumn.__super__.constructor.apply(this, arguments);
  }

  TextColumn.prototype.xtype = 'textcolumn';

  return TextColumn;

})(Column);

module.exports = TextColumn;


},{"./Column":56}],60:[function(require,module,exports){
var Column, ToggleColumn, ToggleInput,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Column = require('./Column');

ToggleInput = require('../../input/Toggle');

ToggleColumn = (function(_super) {
  __extends(ToggleColumn, _super);

  function ToggleColumn() {
    return ToggleColumn.__super__.constructor.apply(this, arguments);
  }

  ToggleColumn.prototype.xtype = 'togglecolumn';

  ToggleColumn.prototype.align = 'center';

  ToggleColumn.prototype.width = 110;

  ToggleColumn.prototype.onState = void 0;

  ToggleColumn.prototype.offState = void 0;

  ToggleColumn.prototype.onText = void 0;

  ToggleColumn.prototype.offText = void 0;

  ToggleColumn.prototype.size = void 0;

  ToggleColumn.prototype.renderValue = function(value, row) {
    var input;
    input = new ToggleInput({
      value: value,
      onState: this.onState,
      offState: this.offState,
      onText: this.onText,
      offText: this.offText,
      size: this.size
    });
    input.on('beforechange', (function(_this) {
      return function() {
        _this.emit('beforechange', _this, input, row);
      };
    })(this));
    input.on('change', (function(_this) {
      return function() {
        row.set(_this.getDataIndex(), input.getValue());
      };
    })(this));
    return input;
  };

  return ToggleColumn;

})(Column);

module.exports = ToggleColumn;


},{"../../input/Toggle":82,"./Column":56}],61:[function(require,module,exports){
var Grid, exports;

exports = {
  Grid: require('./Grid'),
  Action: require('./Action'),
  Operations: require('./Operations'),
  column: {
    Column: require('./column/Column'),
    NumberColumn: require('./column/NumberColumn'),
    DateColumn: require('./column/DateColumn'),
    CheckColumn: require('./column/CheckColumn'),
    CheckerColumn: require('./column/CheckerColumn'),
    TextColumn: require('./column/TextColumn'),
    ToggleColumn: require('./column/ToggleColumn'),
    ActionColumn: require('./column/ActionColumn')
  },
  renderer: {
    GridRenderer: require('./renderer/GridRenderer'),
    WidthManager: require('./renderer/WidthManager')
  },
  utils: {
    PopoverSubmit: require('./utils/PopoverSubmit')
  }
};

Grid = exports.Grid;

Grid.registerColumn('numberColumn', exports.column.NumberColumn);

Grid.registerColumn('dateColumn', exports.column.DateColumn);

Grid.registerColumn('checkColumn', exports.column.CheckColumn);

Grid.registerColumn('textColumn', exports.column.TextColumn);

Grid.registerColumn('toggleColumn', exports.column.ToggleColumn);

module.exports = exports;


},{"./Action":50,"./Grid":51,"./Operations":52,"./column/ActionColumn":53,"./column/CheckColumn":54,"./column/CheckerColumn":55,"./column/Column":56,"./column/DateColumn":57,"./column/NumberColumn":58,"./column/TextColumn":59,"./column/ToggleColumn":60,"./renderer/GridRenderer":62,"./renderer/WidthManager":63,"./utils/PopoverSubmit":64}],62:[function(require,module,exports){
var GridRenderer, WidthManager,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

WidthManager = require('./WidthManager');

GridRenderer = (function(_super) {
  __extends(GridRenderer, _super);

  GridRenderer.prototype.dblclickdelay = 0;

  GridRenderer.prototype.autoSync = true;

  GridRenderer.prototype.autoSyncInterval = null;

  GridRenderer.prototype.grid = null;

  GridRenderer.prototype.columns = null;

  GridRenderer.prototype.thead = null;

  GridRenderer.prototype.tfoot = null;

  GridRenderer.prototype.tbody = null;

  GridRenderer.prototype.tfilters = null;

  GridRenderer.prototype.widthManager = null;

  GridRenderer.prototype.cellClickTimeoutId = null;

  function GridRenderer(grid, config) {
    this.grid = grid;
    GridRenderer.__super__.constructor.call(this, config);
    this.columns = [];
    this.widthManager = new WidthManager(this, this.widthManager);
    if (this.autoSyncInterval) {
      this.syncRowsInterval = setInterval((function(_this) {
        return function() {
          if (_this.requiredSyncRows) {
            _this.syncRows();
          }
        };
      })(this), this.autoSyncInterval);
    }
    return;
  }

  GridRenderer.prototype.render = function() {
    var bodyEl, column, grid, tbodyTable, theadTable, _i, _j, _k, _len, _len1, _len2, _ref, _ref1, _ref2;
    grid = this.grid;
    grid.on("parentshown", this.bound('onGridParentShown'));
    grid.on("selectionchange", this.bound('onSelectionChanged'));
    _ref = grid.getColumns();
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      column = _ref[_i];
      if (column.isCheckerColumn) {
        this.columns.push(column);
      }
    }
    _ref1 = grid.getColumns();
    for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
      column = _ref1[_j];
      if (!column.isCheckerColumn) {
        this.columns.push(column);
      }
    }
    theadTable = new Element("table");
    theadTable.inject(grid.headerEl);
    this.renderHeader(theadTable);
    this.renderFilters(theadTable);
    tbodyTable = new Element("table");
    tbodyTable.inject(grid.bodyEl);
    bodyEl = grid.bodyEl;
    if (grid.stripe) {
      bodyEl.addClass('grid-stripe');
    }
    if (grid.condensed) {
      bodyEl.addClass('grid-condensed');
    }
    if (grid.nowrap) {
      bodyEl.addClass('grid-nowrap');
    }
    if (grid.rowclickable) {
      bodyEl.addClass('grid-rowclickable');
    }
    if (grid.verticalAlign) {
      bodyEl.addClass('grid-align-' + grid.verticalAlign);
    }
    if (grid.size) {
      bodyEl.addClass('grid-' + grid.size);
    }
    this.renderBody(tbodyTable);
    this.renderFooter(grid.footerEl);
    grid.emit("render", grid);
    _ref2 = this.columns;
    for (_k = 0, _len2 = _ref2.length; _k < _len2; _k++) {
      column = _ref2[_k];
      column.afterRender();
    }
  };

  GridRenderer.prototype.afterRender = function() {
    this.widthManager.actualize();
  };

  GridRenderer.prototype.refresh = function() {
    this.destroyRows(this.tbody);
    this.renderBody(this.tbody);
    this.grid.onRefresh();
    this.widthManager.actualize();
  };

  GridRenderer.prototype.setAutoSync = function(autoSync) {
    this.autoSync = autoSync;
    if (this.autoSync) {
      this.syncRows();
    }
  };

  GridRenderer.prototype.recordAdded = function(record) {
    var tr;
    tr = this.renderRow(this.tbody, record, this.tbody.getChildren().length);
    if (this.autoSync) {
      this.requireSyncRows();
    }
    this.widthManager.actualize(tr);
  };

  GridRenderer.prototype.recordRemoved = function(record) {
    var tr;
    tr = this.getRowByRecord(record);
    if (tr) {
      this.destroyRow(tr);
      if (this.autoSync) {
        this.requireSyncRows();
      }
    }
  };

  GridRenderer.prototype.recordUpdated = function(record) {
    var tr;
    tr = this.getRowByRecord(record);
    if (tr) {
      this.updateRow(tr, record);
    } else {
      this.renderRow(this.tbody, record);
    }
    if (this.autoSync) {
      this.requireSyncRows();
    }
  };

  GridRenderer.prototype.renderHeader = function(theadTable) {
    var column, th, thead, tr, _i, _len, _ref;
    thead = new Element("thead", {
      cls: "grid-headers"
    });
    thead.inject(theadTable);
    this.thead = thead;
    tr = new Element("tr").inject(thead);
    _ref = this.columns;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      column = _ref[_i];
      th = new Element("th").inject(tr);
      th.addClass('text-' + column.align);
      if (column.colCls) {
        th.addClass('grid-col-' + column.colCls);
      }
      th.set("column", column.name);
      th.set("html", '<span title="' + (column.title || column.text) + '" data-toggle="tooltip">' + column.renderHeader() + '</span>');
      if (!column.visible) {
        th.setVisible(false);
      }
      if (column.onRenderHeader) {
        column.onRenderHeader(th);
      }
      this.grid.emit("headerrender", this.grid, th, column);
    }
  };

  GridRenderer.prototype.renderFilters = function(theadTable) {};

  GridRenderer.prototype.renderBody = function(tbodyTable) {
    var grid, groups, name, record, records, tbody, value, _i, _len;
    grid = this.grid;
    records = grid.getRecords();
    tbody = new Element("tbody", {
      cls: "grid-rows"
    });
    tbody.inject(tbodyTable);
    tbody.on("click:relay(tr.grid-row-data td)", this.bound('onCellClick'));
    tbody.on("dblclick:relay(tr.grid-row-data td)", this.bound('onCellDblClick'));
    grid.tbodyEl = this.tbody = tbody;
    if (grid.groupBy) {
      groups = {};
      for (_i = 0, _len = records.length; _i < _len; _i++) {
        record = records[_i];
        value = record.get(grid.groupBy);
        if (!groups[value]) {
          groups[value] = [];
        }
        groups[value].push(record);
      }
      grid.emit('beforesync', grid, groups);
      for (name in groups) {
        records = groups[name];
        this.renderGroup(tbody, name);
        this.renderRows(tbody, records);
      }
    } else {
      this.renderRows(tbody, records);
    }
    this.reindexRows();
    grid.emit('aftersync', grid);
  };

  GridRenderer.prototype.renderGroup = function(tbody, name) {
    var td, tr;
    tr = new Element("tr", {
      cls: "grid-row-group",
      parent: tbody,
      'data-group': name
    });
    tr.store("rowid", 'group-' + name);
    td = new Element("td", {
      html: name,
      colspan: this.columns.length,
      parent: tr
    });
    this.grid.emit("grouprender", this.grid, td, name);
  };

  GridRenderer.prototype.renderRows = function(tbody, records) {
    var index, record, _i, _len;
    for (index = _i = 0, _len = records.length; _i < _len; index = ++_i) {
      record = records[index];
      this.renderRow(tbody, record, index);
    }
  };

  GridRenderer.prototype.renderRow = function(tbody, record, index) {
    var column, tr, _i, _len, _ref;
    tr = new Element("tr", {
      cls: "grid-row-data"
    });
    tr.store("record", record);
    tr.store("rowid", record.getId());
    tr.set("data-row", record.getId());
    tr.inject(tbody);
    _ref = this.columns;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      column = _ref[_i];
      this.renderCell(tr, record, column);
    }
    this.grid.emit("rowrender", this.grid, tr, record, index);
    return tr;
  };

  GridRenderer.prototype.updateRow = function(tr, record) {
    var cells, column, td, _i, _j, _len, _len1, _ref, _ref1;
    if (!tr.retrieve("rowid")) {
      tr.set("data-row", record.getId());
      tr.store("rowid", record.getId());
    }
    cells = {};
    _ref = tr.getElements('td');
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      td = _ref[_i];
      cells[td.get('column')] = td;
    }
    _ref1 = this.columns;
    for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
      column = _ref1[_j];
      if (!column.preventUpdateCell) {
        this.updateCell(cells[column.name], record, column);
      }
    }
    this.grid.emit("rowrender", this.grid, tr, record);
  };

  GridRenderer.prototype.renderCell = function(tr, record, column) {
    var td;
    td = new Element("td").inject(tr);
    if (column.colCls) {
      td.addClass('grid-col-' + column.colCls);
    }
    td.addClass("text-" + column.align);
    td.store("dataIndex", column.getDataIndex());
    td.set("column", column.name);
    if (column.titleIndex) {
      td.set("title", record.get(column.titleIndex));
    }
    if (!column.visible) {
      td.setVisible(false);
    }
    this.updateCell(td, record, column);
  };

  GridRenderer.prototype.updateCell = function(td, record, column) {
    var dataIndex, rendered, value;
    dataIndex = column.getDataIndex();
    value = record.get(dataIndex);
    rendered = column.renderValue(value, record);
    if (Type.isObject(rendered) && rendered.isComponent) {
      td.empty();
      rendered.render(td);
    } else {
      td.set('html', rendered);
    }
    if (column.onRenderCell) {
      column.onRenderCell(td, value, record);
    }
    this.grid.emit('cellrender', this.grid, td, value, record);
  };

  GridRenderer.prototype.destroyRows = function(tbody) {
    var tr, _i, _len, _ref;
    _ref = tbody.getElements("tr");
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      tr = _ref[_i];
      if (tr.hasClass('grid-row-group')) {
        tr.destroy();
      } else {
        this.destroyRow(tr);
      }
    }
  };

  GridRenderer.prototype.destroyRow = function(tr) {
    var record, td, _i, _len, _ref;
    record = tr.retrieve('record');
    tr.eliminate('record');
    tr.eliminate('rowid');
    this.grid.emit('rowdestroy', this.grid, tr);
    _ref = tr.getElements('td');
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      td = _ref[_i];
      this.destroyCell(td, record);
    }
    tr.destroy();
  };

  GridRenderer.prototype.destroyCell = function(td, record) {
    var column, name;
    name = td.get('column');
    column = this.grid.get(name);
    if (column.onDestroyCell) {
      column.onDestroyCell(td, record);
    }
    this.grid.emit('celldestroy', this.grid, td);
    td.eliminate('dataIndex');
  };

  GridRenderer.prototype.requireSyncRows = function() {
    if (this.syncRowsInterval) {
      this.requiredSyncRows = true;
    } else {
      this.syncRows();
    }
  };

  GridRenderer.prototype.syncRows = function() {
    var changed, grid, groupName, groupRow, groups, i, id, len, limit, name, positions, rec, record, records, row, rows, value, _i, _j, _k, _l, _len, _len1, _len2, _len3, _len4, _m, _n, _ref, _ref1;
    grid = this.grid;
    records = grid.getRecords();
    this.requiredSyncRows = false;
    if (grid.groupBy) {
      groups = {};
      for (_i = 0, _len = records.length; _i < _len; _i++) {
        record = records[_i];
        value = record.get(grid.groupBy);
        if (!groups[value]) {
          groups[value] = [];
        }
        groups[value].push(record);
      }
    }
    grid.emit('beforesync', grid, groups);
    if (!grid.groupBy) {
      positions = [];
      for (_j = 0, _len1 = records.length; _j < _len1; _j++) {
        rec = records[_j];
        positions.push(rec.getId());
      }
    } else {
      for (name in groups) {
        records = groups[name];
        groupRow = this.tbody.getChildren("tr.grid-row-group[data-group='" + name + "']")[0];
        if (!groupRow) {
          this.renderGroup(this.tbody, name);
        }
      }
      _ref = this.tbody.getChildren('tr.grid-row-group');
      for (_k = 0, _len2 = _ref.length; _k < _len2; _k++) {
        groupRow = _ref[_k];
        groupName = groupRow.get('data-group');
        if (!groups[groupName]) {
          groupRow.destroy();
        }
      }
      positions = [];
      for (name in groups) {
        records = groups[name];
        positions.push('group-' + name);
        for (_l = 0, _len3 = records.length; _l < _len3; _l++) {
          record = records[_l];
          positions.push(record.getId());
        }
      }
    }
    grid.emit('sync', grid, positions);
    rows = {};
    _ref1 = this.tbody.getChildren();
    for (_m = 0, _len4 = _ref1.length; _m < _len4; _m++) {
      row = _ref1[_m];
      rows[row.retrieve('rowid')] = row;
    }
    changed = false;
    len = positions.length;
    limit = Math.round(len / 2);
    for (i = _n = 0; _n <= limit; i = _n += +1) {
      id = positions.shift();
      row = rows[id];
      if (row) {
        if (this.syncRow(row, i)) {
          changed = true;
        }
      }
      id = positions.pop();
      row = rows[id];
      if (row) {
        if (this.syncRow(row, len - i - 1)) {
          changed = true;
        }
      }
    }
    if (changed) {
      this.reindexRows();
    }
    grid.emit('aftersync', grid);
  };

  GridRenderer.prototype.syncRow = function(row, position) {
    var prevRow;
    if (row.getIndex() === position) {
      return false;
    }
    if (position === 0) {
      row.inject(this.tbody, 'top');
    } else {
      prevRow = this.tbody.getChildren('tr:nth-child("' + position + '")')[0];
      row.inject(prevRow, 'after');
    }
    return true;
  };

  GridRenderer.prototype.reindexRows = function() {
    var index, row, _i, _len, _ref;
    index = 0;
    _ref = this.tbody.getChildren('tr.grid-row-data');
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      row = _ref[_i];
      row.set('row-index', index++);
    }
  };

  GridRenderer.prototype.renderFooter = function(footerEl) {
    var hasSelection, paginator, showFooter;
    showFooter = false;
    if (this.grid.paginator) {
      paginator = this.grid.get('paginator');
      paginator.el.addClass('grid-paginator');
      paginator.render(footerEl);
    }
    if (this.grid.operations) {
      showFooter = true;
      hasSelection = this.grid.getSelectionModel().hasSelection();
      this.grid.operations.render(footerEl);
      this.grid.operations.setVisible(hasSelection);
    }
    if (!showFooter) {
      footerEl.hide();
      this.grid.el.addClass('grid-nofooter');
    }
  };

  GridRenderer.prototype.onSelectionChanged = function(grid, sm, selection) {
    var hasSelection;
    hasSelection = selection.length > 0;
    if (this.grid.operations) {
      this.grid.operations.setVisible(hasSelection);
    }
  };

  GridRenderer.prototype.onCellClick = function(e, td) {
    if (td.get('disableclick')) {
      return;
    }
    if (e.target.tagName === 'A') {
      return;
    }
    clearTimeout(this.cellClickTimeoutId);
    this.cellClickTimeoutId = ((function(_this) {
      return function() {
        var info;
        info = _this.getCellInfo(td);
        _this.grid.emit('cellclick', _this.grid, td, info.record, info, e);
        _this.grid.emit('rowclick', _this.grid, info.record, info, e);
      };
    })(this)).delay(this.dblclickdelay);
  };

  GridRenderer.prototype.onCellDblClick = function(e, td) {
    var info;
    if (td.get('disableclick')) {
      return;
    }
    if (e.target.tagName === "A") {
      return;
    }
    clearTimeout(this.cellClickTimeoutId);
    info = this.getCellInfo(td);
    this.grid.emit('celldblclick', this.grid, td, info.record, info, e);
    this.grid.emit('rowdblclick', this.grid, info.record, info, e);
  };

  GridRenderer.prototype.getCellInfo = function(td) {
    var dataIndex, record, tr;
    tr = td.getParent();
    dataIndex = td.retrieve('dataIndex');
    record = tr.retrieve('record');
    return {
      tr: tr,
      cellIndex: td.getIndex(),
      rowIndex: tr.getIndex(),
      record: record,
      value: record.get(dataIndex),
      dataIndex: dataIndex,
      column: td.get('column')
    };
  };

  GridRenderer.prototype.getRowById = function(id) {
    var tr, _i, _len, _ref;
    _ref = this.tbody.getChildren('tr');
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      tr = _ref[_i];
      if (tr.retrieve('rowid') === id) {
        return tr;
      }
    }
    return null;
  };

  GridRenderer.prototype.getRowByRecord = function(record) {
    var tr, _i, _len, _ref;
    _ref = this.tbody.getChildren('tr');
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      tr = _ref[_i];
      if (tr.retrieve('record') === record) {
        return tr;
      }
    }
    return null;
  };

  GridRenderer.prototype.onGridParentShown = function() {
    var wm;
    wm = this.widthManager;
    wm.widths = null;
    wm.actualize();
  };

  GridRenderer.prototype.doDestroy = function() {
    this.widthManager.destroy();
    this.grid.un('parentshown', this.bound('onGridParentShown'));
    this.grid.un('selectionchange', this.bound('onSelectionChanged'));
    this.destroyRows(this.tbody);
    this.grid = this.tbody = this.tfilters = this.thead = this.tfoot = null;
    GridRenderer.__super__.doDestroy.call(this);
  };

  return GridRenderer;

})(Miwo.Object);

module.exports = GridRenderer;


},{"./WidthManager":63}],63:[function(require,module,exports){
var WidthManager,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

WidthManager = (function(_super) {
  __extends(WidthManager, _super);

  WidthManager.prototype.defaultFitWidth = 100;

  WidthManager.prototype.renderer = null;

  WidthManager.prototype.widths = null;

  function WidthManager(renderer, config) {
    this.renderer = renderer;
    WidthManager.__super__.constructor.call(this, config);
    window.on("resize", this.bound("onWindowResize"));
    return;
  }

  WidthManager.prototype.actualize = function(tr) {
    var row, _i, _len, _ref;
    if (!this.widths) {
      this.widths = this.detectWidths();
    }
    if (tr) {
      this.actualizeRow(tr, this.widths);
    } else {
      this.actualizeRow(this.renderer.thead.getChildren('tr')[0], this.widths);
      _ref = this.renderer.tbody.getChildren("tr.grid-row-data");
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        row = _ref[_i];
        this.actualizeRow(row, this.widths);
      }
    }
  };

  WidthManager.prototype.actualizeRow = function(tr, widths) {
    var name, width;
    for (name in widths) {
      width = widths[name];
      if (width !== null) {
        tr.getChildren("[column=\"" + name + "\"]").setStyles({
          width: width,
          maxWidth: width
        });
      }
    }
  };

  WidthManager.prototype.onWindowResize = function() {
    this.widths = null;
    this.actualize();
  };

  WidthManager.prototype.detectWidths = function() {
    var column, columns, fitWidth, freeWidth, isFit, name, renderer, totalFit, widths, wildCount, _i, _j, _k, _len, _len1, _len2, _ref;
    renderer = this.renderer;
    freeWidth = renderer.grid.bodyEl.getWidth();
    totalFit = 0;
    widths = {};
    isFit = false;
    columns = [];
    _ref = renderer.columns;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      column = _ref[_i];
      if (column.isVisible()) {
        columns.push(column);
        if (column.widthType === "fit") {
          isFit = true;
        }
      }
    }
    wildCount = 0;
    for (_j = 0, _len1 = columns.length; _j < _len1; _j++) {
      column = columns[_j];
      name = column.name;
      if (column.widthType === "auto") {
        if (column.width) {
          widths[name] = column.width;
        } else if (isFit) {
          widths[name] = this.defaultFitWidth;
        } else {
          widths[name] = null;
          wildCount++;
        }
        if (widths[name]) {
          freeWidth -= widths[name];
        }
      }
      if (column.widthType === "fit") {
        widths[name] = null;
        totalFit += (column.width ? column.width : 1);
      }
    }
    for (_k = 0, _len2 = columns.length; _k < _len2; _k++) {
      column = columns[_k];
      if (column.widthType === "fit") {
        fitWidth = ((freeWidth * column.width) / totalFit).round();
        if (fitWidth < column.minWidth) {
          widths[column.name] = column.minWidth;
          freeWidth -= column.minWidth;
        } else {
          widths[column.name] = fitWidth;
        }
      } else if (column.widthType === "auto") {
        if (widths[column.name] === null) {
          widths[column.name] = (freeWidth / wildCount).round();
        }
      }
    }
    return widths;
  };

  WidthManager.prototype.doDestroy = function() {
    window.un("resize", this.bound("onWindowResize"));
    this.renderer = null;
    WidthManager.__super__.doDestroy.call(this);
  };

  return WidthManager;

})(Miwo.Object);

module.exports = WidthManager;


},{}],64:[function(require,module,exports){
var Button, Popover, PopoverSubmit,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Popover = require('../../tip/Popover');

Button = require('../../buttons/Button');

PopoverSubmit = (function(_super) {
  __extends(PopoverSubmit, _super);

  function PopoverSubmit() {
    return PopoverSubmit.__super__.constructor.apply(this, arguments);
  }

  PopoverSubmit.prototype.onSubmit = null;

  PopoverSubmit.prototype.onCancel = null;

  PopoverSubmit.prototype.width = 145;

  PopoverSubmit.prototype.doInit = function() {
    var buttonNo, buttonYes;
    PopoverSubmit.__super__.doInit.apply(this, arguments);
    this.el.addClass('grid-popover-submit');
    buttonYes = new Button({
      text: 'Yes',
      type: 'primary',
      handler: (function(_this) {
        return function() {
          if (_this.onSubmit) {
            _this.onSubmit();
          }
          _this.close();
        };
      })(this)
    });
    this.add('yes', buttonYes);
    buttonNo = new Button({
      text: 'No',
      type: 'default',
      handler: (function(_this) {
        return function() {
          if (_this.onCancel) {
            _this.onCancel();
          }
          _this.close();
        };
      })(this)
    });
    this.add('no', buttonNo);
  };

  return PopoverSubmit;

})(Popover);

module.exports = PopoverSubmit;


},{"../../buttons/Button":6,"../../tip/Popover":123}],65:[function(require,module,exports){
miwo.registerExtension('miwo-ui', require('./DiExtension'));

miwo.translator.setTranslates('en', 'miwo', require('./translates'));

Miwo.ui = {};

Miwo.drag = require('./drag');

Miwo.notify = require('./notify');

Miwo.buttons = require('./buttons');

Miwo.navbar = require('./navbar');

Miwo.dropdown = require('./dropdown');

Miwo.input = require('./input');

Miwo.picker = require('./picker');

Miwo.pagination = require('./pagination');

Miwo.form = require('./form');

Miwo.panel = require('./panel');

Miwo.window = require('./window');

Miwo.tabs = require('./tabs');

Miwo.selection = require('./selection');

Miwo.grid = require('./grid');

Miwo.tip = require('./tip');

Miwo.mask = require('./mask');

Miwo.progress = require('./progress');

Miwo.ui.utils = require('./utils');

Miwo.Form = Miwo.form.container.Form;

Miwo.Window = Miwo.window.Window;

Miwo.FormWindow = Miwo.window.FormWindow;

Miwo.Tabs = Miwo.tabs.Tabs;

Miwo.Grid = Miwo.grid.Grid;

Miwo.Pane = Miwo.panel.Pane;


},{"./DiExtension":1,"./buttons":11,"./drag":14,"./dropdown":19,"./form":46,"./grid":61,"./input":83,"./mask":86,"./navbar":89,"./notify":91,"./pagination":95,"./panel":98,"./picker":107,"./progress":111,"./selection":117,"./tabs":120,"./tip":127,"./translates":128,"./utils":132,"./window":138}],66:[function(require,module,exports){
var BaseInput,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

BaseInput = (function(_super) {
  __extends(BaseInput, _super);

  function BaseInput() {
    return BaseInput.__super__.constructor.apply(this, arguments);
  }

  BaseInput.prototype.isInput = true;

  BaseInput.prototype.getInputEl = function() {
    return this.inputEl;
  };

  BaseInput.prototype.getInputId = function(name) {
    if (name == null) {
      name = 'input';
    }
    return this.id + '-' + name;
  };

  BaseInput.prototype.afterRender = function() {
    BaseInput.__super__.afterRender.call(this);
    if (!this.focusEl) {
      this.focusEl = this.getInputEl();
    }
    this.setDisabled(this.disabled);
  };

  return BaseInput;

})(Miwo.Component);

module.exports = BaseInput;


},{}],67:[function(require,module,exports){
var BaseInput, BaseTextInput,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

BaseInput = require('./BaseInput');

BaseTextInput = (function(_super) {
  __extends(BaseTextInput, _super);

  function BaseTextInput() {
    return BaseTextInput.__super__.constructor.apply(this, arguments);
  }

  BaseTextInput.prototype.el = 'input';

  BaseTextInput.prototype.disabled = false;

  BaseTextInput.prototype.readonly = false;

  BaseTextInput.prototype.placeholder = null;

  BaseTextInput.prototype.tabindex = 0;

  BaseTextInput.prototype.inputName = null;

  BaseTextInput.prototype.componentCls = 'form-control';

  BaseTextInput.prototype.getInputEl = function() {
    return this.el;
  };

  BaseTextInput.prototype.setValue = function(value) {
    this.el.set("value", value);
  };

  BaseTextInput.prototype.getValue = function() {
    return this.el.get("value");
  };

  BaseTextInput.prototype.setDisabled = function(disabled) {
    this.disabled = disabled;
    this.el.set("disabled", this.disabled);
  };

  BaseTextInput.prototype.setReadonly = function(readonly) {
    this.readonly = readonly;
    this.el.set("readonly", this.readonly);
  };

  BaseTextInput.prototype.setPlaceholder = function(placeholder) {
    this.placeholder = placeholder;
    this.el.set("placeholder", this.placeholder);
  };

  BaseTextInput.prototype.doRender = function() {
    this.el.set("tabindex", this.tabindex);
    this.el.set("name", this.inputName || this.name);
    if (this.placeholder !== null) {
      this.el.set("placeholder", this.placeholder);
    }
    if (this.readonly) {
      this.el.set("readonly", this.readonly);
    }
    if (this.disabled) {
      this.el.set("disabled", this.disabled);
    }
  };

  return BaseTextInput;

})(BaseInput);

module.exports = BaseTextInput;


},{"./BaseInput":66}],68:[function(require,module,exports){
var BaseInput, Checkbox,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

BaseInput = require('./BaseInput');

Checkbox = (function(_super) {
  __extends(Checkbox, _super);

  function Checkbox() {
    return Checkbox.__super__.constructor.apply(this, arguments);
  }

  Checkbox.prototype.xtype = 'checkboxinput';

  Checkbox.prototype.baseCls = 'checkbox';

  Checkbox.prototype.label = '';

  Checkbox.prototype.disabled = false;

  Checkbox.prototype.checked = false;

  Checkbox.prototype.inputEl = null;

  Checkbox.prototype.iconEl = null;

  Checkbox.prototype.checkerEl = null;

  Checkbox.prototype.labelEl = null;

  Checkbox.prototype.textEl = null;

  Checkbox.prototype.doRender = function() {
    this.el.set('html', "<label miwo-reference=\"labelEl\" for='" + (this.getInputId()) + "'>\n	<span miwo-reference=\"checkerEl\" class=\"checker\" tabindex=\"0\">\n		<i miwo-reference=\"iconEl\" class=\"fa\"></i>\n		<input miwo-reference=\"inputEl\" type=\"checkbox\" id='" + (this.getInputId()) + "' tabindex=\"-1\">\n	</span>\n	<span miwo-reference=\"textEl\" class=\"label-text\">" + this.label + "</span>\n</label>");
  };

  Checkbox.prototype.afterRender = function() {
    Checkbox.__super__.afterRender.call(this);
    this.inputEl.on('change', (function(_this) {
      return function() {
        if (_this.disabled) {
          return;
        }
        _this.setChecked(_this.getValue());
        _this.emit('change', _this, _this.getValue());
        _this.setFocus();
      };
    })(this));
    this.inputEl.on('focus', (function(_this) {
      return function() {
        if (_this.disabled) {
          return;
        }
        _this.setFocus();
      };
    })(this));
    this.checkerEl.on('focus', (function(_this) {
      return function() {
        if (_this.disabled) {
          return;
        }
        _this.setFocus();
      };
    })(this));
    this.checkerEl.on('keydown', (function(_this) {
      return function(e) {
        if (_this.disabled) {
          return;
        }
        if (e.key === 'space' || e.key === 'enter') {
          e.stop();
          _this.setChecked(!_this.checked);
        }
      };
    })(this));
    this.inputEl.on('blur', (function(_this) {
      return function() {
        if (_this.disabled) {
          return;
        }
        _this.blur();
      };
    })(this));
    this.focusEl = this.checkerEl;
    this.setChecked(this.checked);
  };

  Checkbox.prototype.blur = function() {
    Checkbox.__super__.blur.call(this);
    this.el.removeClass('focus');
  };

  Checkbox.prototype.setChecked = function(checked) {
    this.checked = checked;
    this.el.toggleClass('checked', this.checked);
    this.inputEl.set('checked', this.checked);
    this.updateIconCls();
  };

  Checkbox.prototype.isChecked = function() {
    return this.checked;
  };

  Checkbox.prototype.setDisabled = function(disabled) {
    this.disabled = disabled;
    this.el.toggleClass('disabled', this.disabled);
    this.inputEl.set('disabled', this.disabled);
    this.checkerEl.set('tabindex', -this.disabled);
    this.updateIconCls();
  };

  Checkbox.prototype.updateIconCls = function() {
    this.iconEl.removeClass('fa-check-square-o').removeClass('fa-square-o').removeClass('fa-check-square').removeClass('fa-square');
    if (this.disabled) {
      this.iconEl.addClass(this.checked ? 'fa-check-square' : 'fa-square');
    } else {
      this.iconEl.addClass(this.checked ? 'fa-check-square-o' : 'fa-square-o');
    }
  };

  Checkbox.prototype.setLabel = function(label) {
    this.textEl.set('text', label);
  };

  Checkbox.prototype.setValue = function(checked) {
    this.setChecked(!!checked);
  };

  Checkbox.prototype.getValue = function() {
    return this.isChecked();
  };

  return Checkbox;

})(BaseInput);

module.exports = Checkbox;


},{"./BaseInput":66}],69:[function(require,module,exports){
var Checkbox, CheckboxList,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Checkbox = require('./Checkbox');

CheckboxList = (function(_super) {
  __extends(CheckboxList, _super);

  function CheckboxList() {
    return CheckboxList.__super__.constructor.apply(this, arguments);
  }

  CheckboxList.prototype.xtype = 'checkboxlistinput';

  CheckboxList.prototype.isInput = true;

  CheckboxList.prototype.inline = false;

  CheckboxList.prototype.baseCls = 'checkboxlist';

  CheckboxList.prototype.setChecked = function(name, checked) {
    this.get(name).setChecked(checked);
  };

  CheckboxList.prototype.setDisabled = function(name, disabled) {
    if (Type.isString(name)) {
      this.get(name).setDisabled(disabled);
    } else {
      disabled = name;
      this.components.each((function(_this) {
        return function(checkbox) {
          checkbox.setDisabled(disabled);
        };
      })(this));
    }
  };

  CheckboxList.prototype.setValue = function(value) {
    this.components.each((function(_this) {
      return function(checkbox, name) {
        checkbox.setChecked(value.indexOf(name) >= 0);
      };
    })(this));
  };

  CheckboxList.prototype.getValue = function() {
    var value;
    value = [];
    this.components.each((function(_this) {
      return function(checkbox, name) {
        if (checkbox.isChecked() && !checkbox.disabled) {
          value.push(name);
        }
      };
    })(this));
    return value;
  };

  CheckboxList.prototype.addItem = function(name, label) {
    this.add(name, this.createCheckbox(name, label));
  };

  CheckboxList.prototype.createCheckbox = function(name, label) {
    var checkbox;
    checkbox = new Checkbox({
      id: this.id + '-' + name,
      label: label,
      cls: this.inline ? 'checkbox-inline' : null
    });
    checkbox.on('change', (function(_this) {
      return function() {
        _this.emit('change', _this);
      };
    })(this));
    checkbox.on('blur', (function(_this) {
      return function() {
        _this.emit('blur', _this);
      };
    })(this));
    checkbox.on('focus', (function(_this) {
      return function() {
        _this.emit('focus', _this);
      };
    })(this));
    return checkbox;
  };

  CheckboxList.prototype.clear = function() {
    this.components.each((function(_this) {
      return function(component, name) {
        _this.removeComponent(name);
        component.destroy();
      };
    })(this));
  };

  return CheckboxList;

})(Miwo.Container);

module.exports = CheckboxList;


},{"./Checkbox":68}],70:[function(require,module,exports){
var BaseInput, Button, ColorInput,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Button = require('../buttons/Button');

BaseInput = require('./BaseInput');

ColorInput = (function(_super) {
  __extends(ColorInput, _super);

  function ColorInput() {
    return ColorInput.__super__.constructor.apply(this, arguments);
  }

  ColorInput.prototype.xtype = "colorinput";

  ColorInput.prototype.baseCls = 'colorfield';

  ColorInput.prototype.value = '#ffffff';

  ColorInput.prototype.readonly = false;

  ColorInput.prototype.resettable = false;

  ColorInput.prototype.pickerPlacement = 'bottom';

  ColorInput.prototype.popover = null;

  ColorInput.prototype.doRender = function() {
    this.el.addClass('clearfix');
    this.inputEl = new Element('input', {
      id: this.getInputId(),
      cls: 'form-control ' + this.getBaseCls('color'),
      type: 'color',
      tabindex: 0,
      parent: this.el
    });
    this.textEl = new Element('input', {
      id: this.getInputId('color'),
      cls: 'form-control ' + this.getBaseCls('text'),
      type: 'text',
      tabindex: -1,
      parent: this.el
    });
    this.resetBtn = new Button({
      icon: 'remove',
      visible: this.resettable,
      handler: (function(_this) {
        return function() {
          _this.emit('reset', _this);
          _this.setFocus();
        };
      })(this)
    });
    this.resetBtn.render(this.el);
    this.inputEl.on('click', this.bound('onInputClick'));
    this.textEl.on('mousedown', this.bound('onInputClick'));
  };

  ColorInput.prototype.onInputClick = function(event) {
    event.stop();
    if (this.focus) {
      this.setFocus();
    }
    this.openPicker();
  };

  ColorInput.prototype.afterRender = function() {
    ColorInput.__super__.afterRender.call(this);
    this.inputEl.on('keydown', (function(_this) {
      return function(event) {
        if (event.key === 'space' || event.key === 'enter') {
          event.stop();
          _this.openPicker();
        }
      };
    })(this));
    this.inputEl.on('focus', (function(_this) {
      return function() {
        _this.setFocus();
      };
    })(this));
    this.inputEl.on('blur', (function(_this) {
      return function() {
        _this.blur();
      };
    })(this));
  };

  ColorInput.prototype.setValue = function(value) {
    this.inputEl.set("value", value);
    this.textEl.set("value", value);
    return this;
  };

  ColorInput.prototype.getValue = function() {
    return this.inputEl.get("value");
  };

  ColorInput.prototype.setDisabled = function(disabled) {
    ColorInput.__super__.setDisabled.call(this, disabled);
    this.inputEl.set('disabled', disabled);
    this.textEl.set('disabled', disabled);
    this.resetBtn.setDisabled(disabled);
    return this;
  };

  ColorInput.prototype.setResettable = function(resettable) {
    this.resettable = resettable;
    this.resetBtn.setVisible(this.resettable);
    return this;
  };

  ColorInput.prototype.openPicker = function() {
    if (this.disabled || this.readonly) {
      return;
    }
    if (!this.popover) {
      this.popover = this.createPicker();
    }
    this.popover.show();
    this.popover.get('picker').setColor(this.getValue());
  };

  ColorInput.prototype.hidePicker = function() {
    this.popover.close();
  };

  ColorInput.prototype.createPicker = function() {
    var picker, popover;
    popover = miwo.pickers.createPopoverPicker('color', {
      target: this.inputEl,
      placement: this.pickerPlacement
    });
    picker = popover.get('picker');
    picker.on('changed', (function(_this) {
      return function(picker, hex) {
        var value;
        value = _this.formatColor(hex);
        _this.emit("changed", _this, value);
      };
    })(this));
    picker.on('selected', (function(_this) {
      return function(picker, hex) {
        var value;
        value = _this.formatColor(hex);
        _this.setValue(value);
        _this.emit('selected', _this, value);
        _this.hidePicker();
      };
    })(this));
    popover.on('close', (function(_this) {
      return function() {
        _this.popover = null;
        _this.setFocus();
        _this.emit("changed", _this, _this.getValue());
      };
    })(this));
    return popover;
  };

  ColorInput.prototype.formatColor = function(color) {
    return '#' + color.toLowerCase();
  };

  ColorInput.prototype.doDestroy = function() {
    if (this.popover) {
      this.popover.destroy();
    }
    if (this.resetBtn) {
      this.resetBtn.destroy();
    }
    return ColorInput.__super__.doDestroy.call(this);
  };

  return ColorInput;

})(BaseInput);

module.exports = ColorInput;


},{"../buttons/Button":6,"./BaseInput":66}],71:[function(require,module,exports){
var BaseInput, ComboInput, ScreenMask,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

ScreenMask = require('../utils/ScreenMask');

BaseInput = require('./BaseInput');

ComboInput = (function(_super) {
  __extends(ComboInput, _super);

  ComboInput.prototype.xtype = 'comboinput';

  ComboInput.prototype.role = 'combobox';

  ComboInput.prototype.hideSelected = false;

  ComboInput.prototype.multiple = false;

  ComboInput.prototype.height = null;

  ComboInput.prototype.placeholder = '';

  ComboInput.prototype.prompt = false;

  ComboInput.prototype.items = null;

  ComboInput.prototype.disabled = false;

  ComboInput.prototype.opened = false;

  ComboInput.prototype.inputEl = null;

  ComboInput.prototype.resetEl = null;

  ComboInput.prototype.dropdownEl = null;

  ComboInput.prototype.dropdownItemsEl = null;

  ComboInput.prototype.activeItemIndex = -1;

  ComboInput.prototype.activeValueIndex = -1;

  ComboInput.prototype.active = false;

  ComboInput.prototype.screenMask = null;

  function ComboInput(config) {
    ComboInput.__super__.constructor.call(this, config);
    this.items = [];
    return;
  }

  ComboInput.prototype.afterInit = function() {
    ComboInput.__super__.afterInit.call(this);
    this.el.set('html', '<div class="combo-input">' + '<span class="combo-input-text">' + this.placeholder + '</span>' + '<span class="combo-input-reset" style="display: none;"><i class="glyphicon glyphicon glyphicon-remove"></i></span>' + '<span class="combo-input-arrow"><i class="glyphicon glyphicon-chevron-down"></i></span>' + '</div>' + '<input name="' + this.name + '" class="screen-off" id="' + this.id + '-input" type="text" role="button" aria-haspopup="true" aria-labelledby="' + this.id + '-input" tabindex="-1" >');
    this.el.set('tabindex', 0);
    this.control = this.el.getElement('.combo-input');
    this.inputEl = this.el.getElement('input');
    this.textEl = this.el.getElement('.combo-input-text');
    this.resetEl = this.el.getElement('.combo-input-reset');
    this.screenMask = new ScreenMask((function(_this) {
      return function() {
        return _this.close();
      };
    })(this));
    this.dropdownEl = new Element('div', {
      cls: 'combo-dropdown'
    });
    this.dropdownItemsEl = new Element('div', {
      cls: 'combo-dropdown-items',
      parent: this.dropdownEl
    });
  };

  ComboInput.prototype.doRender = function() {
    this.el.addClass('form-control combo combo-empty');
    if (this.height) {
      this.el.setStyle('height', this.height);
    }
    this.el.on('mousedown', (function(_this) {
      return function(event) {
        if (_this.disabled) {
          event.stop();
        }
      };
    })(this));
    this.el.on('click', (function(_this) {
      return function() {
        if (_this.disabled) {
          return;
        }
        _this.setFocus();
        _this.open();
      };
    })(this));
    this.el.on('focus', (function(_this) {
      return function() {
        if (_this.disabled) {
          return;
        }
        _this.setFocus();
      };
    })(this));
    this.el.on('blur', (function(_this) {
      return function() {
        if (_this.disabled) {
          return;
        }
        _this.blur();
      };
    })(this));
    this.dropdownEl.on('click:relay(.combo-dropdown-item)', (function(_this) {
      return function(event, target) {
        var val;
        event.stop();
        if (target.hasClass('disabled')) {
          return;
        }
        val = target.get('data-value');
        _this.setValue((_this.multiple ? _this.getValue().include(val) : val));
        _this.close();
      };
    })(this));
    this.dropdownEl.on('mouseenter:relay(.combo-dropdown-item)', (function(_this) {
      return function(event, target) {
        event.stop();
        if (target.hasClass('disabled')) {
          return;
        }
        _this.activateItem(target.get('data-index'));
      };
    })(this));
    this.textEl.on('click:relay(.combo-input-text li)', (function(_this) {
      return function(event, target) {
        var val;
        if (_this.disabled) {
          return;
        }
        event.stop();
        if (target.hasClass('disabled')) {
          return;
        }
        val = target.get('data-value');
        _this.setValue(_this.getValue().erase(val));
      };
    })(this));
    this.textEl.on('mouseenter:relay(li)', (function(_this) {
      return function(event, target) {
        if (_this.disabled) {
          return;
        }
        event.stop();
        if (target.hasClass('disabled')) {
          return;
        }
        _this.activateValue(parseInt(target.get('data-index')));
      };
    })(this));
    this.textEl.on('mouseleave:relay(li)', (function(_this) {
      return function(event, target) {
        if (_this.disabled) {
          return;
        }
        event.stop();
        if (target.hasClass('disabled')) {
          return;
        }
        _this.activateValue(-1);
      };
    })(this));
    this.resetEl.on('click', (function(_this) {
      return function(event) {
        if (_this.disabled) {
          return;
        }
        event.stop();
        _this.setValue();
      };
    })(this));
    this.keyListener = new Miwo.utils.KeyListener(this.el, 'keydown');
    this.keyListener.on('esc', (function(_this) {
      return function() {
        if (_this.disabled) {
          return;
        }
        _this.close();
        return true;
      };
    })(this));
    this.keyListener.on('up', (function(_this) {
      return function() {
        if (_this.disabled) {
          return;
        }
        _this.open();
        _this.activatePrevItem();
        return true;
      };
    })(this));
    this.keyListener.on('down', (function(_this) {
      return function() {
        if (_this.disabled) {
          return;
        }
        _this.open();
        _this.activateNextItem();
        return true;
      };
    })(this));
    this.keyListener.on('left', (function(_this) {
      return function() {
        if (_this.disabled) {
          return;
        }
        if (_this.multiple) {
          _this.activatePrevValue();
        }
        return true;
      };
    })(this));
    this.keyListener.on('right', (function(_this) {
      return function() {
        if (_this.disabled) {
          return;
        }
        if (_this.multiple) {
          _this.activateNextValue();
        }
        return true;
      };
    })(this));
    this.keyListener.on('backspace', (function(_this) {
      return function() {
        var item, val;
        if (_this.disabled) {
          return;
        }
        if (!_this.opened) {
          if ((item = _this.getActiveValue()) && !item.hasClass('disabled')) {
            val = item.get('data-value');
            _this.setValue(_this.getValue().erase(val));
          } else {
            _this.activateLastValue();
            if ((item = _this.getActiveValue()) && !item.hasClass('disabled')) {
              val = item.get('data-value');
              _this.setValue(_this.getValue().erase(val));
            }
          }
        }
        return true;
      };
    })(this));
    this.keyListener.on('enter', (function(_this) {
      return function() {
        var item, val;
        if (_this.disabled) {
          return;
        }
        if (_this.opened) {
          if ((item = _this.getActiveItem()) && !item.hasClass('disabled')) {
            val = item.get('data-value');
            _this.setValue((_this.multiple ? _this.getValue().include(val) : val));
            _this.close();
          }
          return true;
        }
      };
    })(this));
    this.focusEl = this.el;
  };

  ComboInput.prototype.setValue = function(value, silent) {
    var content, i, inputValue, item, selected, v, _i, _j, _len, _len1, _ref;
    if (value === void 0 || value === null) {
      value = '';
    }
    if (!Type.isArray(value)) {
      value = [value];
    }
    if (this.multiple) {
      content = '<ul>';
      for (i = _i = 0, _len = value.length; _i < _len; i = ++_i) {
        v = value[i];
        content += '<li class="combo-value" data-index="' + i + '" data-value="' + v + '" >' + this.getItemText(v) + '<i class="glyphicon glyphicon-remove"></i></li>';
      }
      content += '</ul>';
      inputValue = value.join(',');
    } else {
      content = this.getItemText(value[0]);
      inputValue = value[0];
    }
    this.el.toggleClass('combo-empty', !inputValue);
    this.textEl.set('html', inputValue ? content : this.placeholder);
    if (this.inputEl.get('value') !== inputValue) {
      this.inputEl.set('value', inputValue);
      if (!silent) {
        this.inputEl.emit('change');
      }
      if (!silent) {
        this.emit('change', this, inputValue);
      }
    }
    this.activeValueIndex = -1;
    if (this.hideSelected) {
      _ref = this.items;
      for (_j = 0, _len1 = _ref.length; _j < _len1; _j++) {
        item = _ref[_j];
        selected = value.indexOf(item.get('data-value')) >= 0;
        item.setVisible(!selected);
        item.toggleClass('selected', selected);
      }
    }
    this.resetEl.setVisible(!this.disabled && this.prompt && value[0] !== void 0 && value[0] !== '');
  };

  ComboInput.prototype.getValue = function() {
    var value;
    value = this.inputEl.get('value');
    if (this.multiple) {
      if (value) {
        return value.split(',');
      } else {
        return [];
      }
    } else {
      return value;
    }
  };

  ComboInput.prototype.getItemText = function(value) {
    var el;
    el = this.dropdownEl.getElement('[data-value="' + value + '"]');
    if (el) {
      return el.comboText;
    } else {
      return '';
    }
  };

  ComboInput.prototype.addOption = function(value, text, content) {
    var item;
    item = new Element('div', {
      cls: 'combo-dropdown-item',
      'data-value': value,
      html: content || text,
      'data-index': this.items.length
    });
    item.comboText = text;
    item.inject(this.dropdownItemsEl);
    this.items.push(item);
    if (!this.prompt && this.getValue() === '') {
      this.setValue(value);
    }
  };

  ComboInput.prototype.addOptions = function(items) {
    var item, _i, _len;
    for (_i = 0, _len = items.length; _i < _len; _i++) {
      item = items[_i];
      this.addOption(item.value, item.text, item.content);
    }
  };

  ComboInput.prototype.setOptions = function(items) {
    this.clear();
    this.addOptions(items);
  };

  ComboInput.prototype.setOptionDisabled = function(name, disabled) {
    this.getOption(name).toggleClass('disabled', disabled);
  };

  ComboInput.prototype.getOption = function(name) {
    return this.dropdownItemsEl.getElement('[data-value="' + name + '"]');
  };

  ComboInput.prototype.setPrompt = function(text) {
    this.prompt = text;
  };

  ComboInput.prototype.clear = function() {
    this.items.empty();
    this.dropdownItemsEl.empty();
  };

  ComboInput.prototype.setDisabled = function(disabled) {
    ComboInput.__super__.setDisabled.call(this, disabled);
    this.el.toggleClass('disabled', disabled);
  };

  ComboInput.prototype.open = function() {
    var pos, size;
    if (this.opened) {
      return;
    }
    this.opened = true;
    this.setFocus();
    this.el.addClass('combo-open');
    this.screenMask.show();
    this.dropdownEl.inject(miwo.body);
    this.dropdownEl.addClass('active');
    pos = this.el.getPosition();
    size = this.el.getSize();
    this.dropdownEl.setStyles({
      top: pos.y + size.y,
      left: pos.x,
      width: size.x
    });
    if (this.activeItemIndex < 0) {
      this.activateNextItem();
    }
  };

  ComboInput.prototype.close = function() {
    if (!this.opened) {
      return;
    }
    this.opened = false;
    this.el.removeClass('combo-open');
    this.dropdownEl.removeClass('active');
    this.dropdownEl.dispose();
    this.screenMask.hide();
    this.setFocus();
  };

  ComboInput.prototype.getActiveItem = function() {
    return this.items[this.activeItemIndex] || null;
  };

  ComboInput.prototype.activateItem = function(index) {
    if (this.activeItemIndex >= 0) {
      this.items[this.activeItemIndex].removeClass('active');
      this.activeItemIndex = -1;
    }
    if (index >= 0 && index < this.items.length) {
      this.items[index].addClass('active');
      this.activeItemIndex = index;
    }
  };

  ComboInput.prototype.activatePrevItem = function() {
    var activateIndex, index, item, _i, _len, _ref;
    activateIndex = null;
    _ref = this.items;
    for (index = _i = 0, _len = _ref.length; _i < _len; index = ++_i) {
      item = _ref[index];
      if (!item.hasClass('selected') && !item.hasClass('disabled') && index < this.activeItemIndex) {
        activateIndex = index;
      }
    }
    if (activateIndex !== null) {
      this.activateItem(activateIndex);
    }
  };

  ComboInput.prototype.activateNextItem = function() {
    var activateIndex, index, item, _i, _len, _ref;
    activateIndex = null;
    _ref = this.items;
    for (index = _i = 0, _len = _ref.length; _i < _len; index = ++_i) {
      item = _ref[index];
      if (!item.hasClass('selected') && !item.hasClass('disabled') && index > this.activeItemIndex) {
        activateIndex = index;
        break;
      }
    }
    if (activateIndex !== null) {
      this.activateItem(activateIndex);
    }
  };

  ComboInput.prototype.getValueElAt = function(index) {
    return this.textEl.getElement('li:nth-child(' + (index + 1) + ')');
  };

  ComboInput.prototype.getActiveValue = function() {
    return this.getValueElAt(this.activeValueIndex) || null;
  };

  ComboInput.prototype.activateValue = function(index) {
    var activeItem, item;
    if (this.activeValueIndex >= 0) {
      activeItem = this.getValueElAt(this.activeValueIndex);
      activeItem.removeClass('active');
    }
    if (index >= 0 && index < this.getValue().length) {
      item = this.getValueElAt(index);
      if (!item.hasClass('disabled')) {
        item.addClass('active');
        this.activeValueIndex = index;
      }
    }
  };

  ComboInput.prototype.activatePrevValue = function() {
    var index;
    if (this.activeValueIndex < 0) {
      index = this.getValue().length - 1;
    } else {
      index = this.activeValueIndex === 0 ? this.getValue().length - 1 : this.activeValueIndex - 1;
    }
    this.activateValue(index);
  };

  ComboInput.prototype.activateNextValue = function() {
    var index;
    if (this.activeValueIndex < 0) {
      index = 0;
    } else {
      index = this.getValue().length === this.activeValueIndex + 1 ? 0 : this.activeValueIndex + 1;
    }
    this.activateValue(index);
  };

  ComboInput.prototype.activateLastValue = function() {
    this.activateValue(this.getValue().length - 1);
  };

  ComboInput.prototype.doDestroy = function() {
    this.screenMask.destroy();
    this.keyListener.destroy();
    return ComboInput.__super__.doDestroy.apply(this, arguments);
  };

  return ComboInput;

})(BaseInput);

module.exports = ComboInput;


},{"../utils/ScreenMask":131,"./BaseInput":66}],72:[function(require,module,exports){
var Composite,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Composite = (function(_super) {
  __extends(Composite, _super);

  function Composite() {
    return Composite.__super__.constructor.apply(this, arguments);
  }

  Composite.prototype.xtype = 'composite';

  Composite.prototype.componentCls = 'form-composite';

  Composite.prototype.labelSeparator = ', ';

  Composite.prototype.getInputs = function() {
    return this.getComponents().toArray();
  };

  Composite.prototype.setValue = function(value) {
    var input, _i, _len, _ref;
    value = value || {};
    _ref = this.getInputs();
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      input = _ref[_i];
      if (value.hasOwnProperty(input.name)) {
        input.setValue(value[input.name]);
      }
    }
  };

  Composite.prototype.getValue = function() {
    var input, value, _i, _len, _ref;
    value = {};
    _ref = this.getInputs();
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      input = _ref[_i];
      value[input.name] = input.getValue();
    }
    return value;
  };

  Composite.prototype.setDisabled = function(disabled) {
    var input, _i, _len, _ref;
    this.disabled = disabled;
    _ref = this.getInputs();
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      input = _ref[_i];
      input.setDisabled(this.disabled);
    }
  };

  Composite.prototype.setReadonly = function(readonly) {
    var input, _i, _len, _ref;
    this.readonly = readonly;
    _ref = this.getInputs();
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      input = _ref[_i];
      input.setReadonly(this.readonly);
    }
  };

  return Composite;

})(Miwo.Container);

module.exports = Composite;


},{}],73:[function(require,module,exports){
var DateInput, TextInput,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

TextInput = require('./Text');

DateInput = (function(_super) {
  __extends(DateInput, _super);

  function DateInput() {
    return DateInput.__super__.constructor.apply(this, arguments);
  }

  DateInput.prototype.xtype = 'dateinput';

  DateInput.prototype.type = 'date';

  DateInput.prototype.placeholder = 'yyyy-mm-dd';

  DateInput.prototype.startDate = null;

  DateInput.prototype.endDate = null;

  DateInput.prototype.todayBtn = false;

  DateInput.prototype.clearBtn = false;

  DateInput.prototype.rangeSelector = null;

  DateInput.prototype.rangeStart = null;

  DateInput.prototype.rangeEnd = null;

  DateInput.prototype.popover = null;

  DateInput.prototype.doInit = function() {
    DateInput.__super__.doInit.apply(this, arguments);
    this.startDate = this.parseDate(this.startDate);
    this.endDate = this.parseDate(this.endDate);
    this.rangeStart = this.parseDate(this.rangeStart) || null;
    this.rangeEnd = this.parseDate(this.rangeEnd) || null;
  };

  DateInput.prototype.afterRender = function() {
    DateInput.__super__.afterRender.apply(this, arguments);
    this.el.set('type', 'text');
    this.el.on('click', (function(_this) {
      return function() {
        return _this.openPicker();
      };
    })(this));
    this.el.on('keydown', (function(_this) {
      return function(e) {
        return _this.onKeyDown(e);
      };
    })(this));
  };

  DateInput.prototype.onKeyDown = function(e) {
    if (e.key.length === 1) {
      e.stop();
    } else if (e.key === 'up' || e.key === 'down' || e.key === 'left' || e.key === 'right') {
      e.stop();
      this.openPicker();
    } else if (e.key === 'backspace') {
      e.stop();
      this.setValue('');
    }
  };

  DateInput.prototype.setValue = function(value) {
    if (value && !Type.isDate(value)) {
      value = this.parseDate(value);
    }
    DateInput.__super__.setValue.call(this, value ? this.formatDate(value) : '');
    if (this.rangeSelector === 'start') {
      this.setRange(value || false, null, true);
    } else if (this.rangeSelector === 'end') {
      this.setRange(null, value || false, true);
    }
  };

  DateInput.prototype.setStartDate = function(date) {
    this.startDate = this.parseDate(date);
    if (this.popover) {
      this.popover.get('picker').setStartDate(date);
    }
  };

  DateInput.prototype.setEndDate = function(date) {
    this.endDate = this.parseDate(date);
    if (this.popover) {
      this.popover.get('picker').setEndDate(date);
    }
  };

  DateInput.prototype.setRange = function(rangeStart, rangeEnd, silent) {
    this.rangeStart = rangeStart === false ? false : this.parseDate(rangeStart) || this.rangeStart;
    this.rangeEnd = rangeEnd === false ? false : this.parseDate(rangeEnd) || this.rangeEnd;
    if (this.popover) {
      this.popover.get('picker').setRange(this.rangeStart, this.rangeEnd, silent);
    }
  };

  DateInput.prototype.openPicker = function() {
    if (this.disabled || this.readonly) {
      return;
    }
    if (!this.popover) {
      this.popover = this.createPicker();
    }
    this.popover.show();
    this.popover.get('picker').setDate(this.parseDate(this.getValue()), true);
    this.popover.get('picker').setFocus();
  };

  DateInput.prototype.hidePicker = function() {
    this.popover.close();
  };

  DateInput.prototype.createPicker = function() {
    var popover;
    popover = miwo.pickers.createPopoverPicker('date', {
      target: this.el,
      type: this.type,
      rangeSelector: this.rangeSelector,
      rangeStart: this.rangeStart || null,
      rangeEnd: this.rangeEnd || null,
      startDate: this.startDate,
      endDate: this.endDate,
      todayBtn: this.todayBtn,
      clearBtn: this.clearBtn
    });
    popover.get('picker').on('selected', (function(_this) {
      return function(picker, date) {
        _this.setValue(date);
        _this.hidePicker();
        _this.emit('changed', _this, _this.getValue(), date);
      };
    })(this));
    popover.on('close', (function(_this) {
      return function() {
        _this.popover = null;
        _this.setFocus();
      };
    })(this));
    return popover;
  };

  DateInput.prototype.formatDate = function(date) {
    return date.getFullYear() + '-' + (date.getMonth() + 1).pad(2) + '-' + date.getDate().pad(2);
  };

  DateInput.prototype.parseDate = function(value) {
    var parts;
    if (!value) {
      return null;
    }
    if (Type.isDate(value)) {
      return value;
    }
    if (!value.match(/[0-9]{4}-[0-9]{2}-[0-9]{2}/)) {
      return null;
    }
    parts = value.split('-');
    return new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
  };

  DateInput.prototype.doDestroy = function() {
    if (this.popover) {
      this.popover.destroy();
    }
    return DateInput.__super__.doDestroy.apply(this, arguments);
  };

  return DateInput;

})(TextInput);

module.exports = DateInput;


},{"./Text":80}],74:[function(require,module,exports){
var DateInput, DateRangeInput,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

DateInput = require('./Date');

DateRangeInput = (function(_super) {
  __extends(DateRangeInput, _super);

  function DateRangeInput() {
    return DateRangeInput.__super__.constructor.apply(this, arguments);
  }

  DateRangeInput.prototype.xtype = 'daterangeinput';

  DateRangeInput.prototype.isInput = true;

  DateRangeInput.prototype.placeholder = 'yyyy-mm-dd';

  DateRangeInput.prototype.readonly = false;

  DateRangeInput.prototype.startDate = null;

  DateRangeInput.prototype.endDate = null;

  DateRangeInput.prototype.todayBtn = false;

  DateRangeInput.prototype.clearBtn = false;

  DateRangeInput.prototype.baseCls = 'daterange';

  DateRangeInput.prototype.doInit = function() {
    DateRangeInput.__super__.doInit.apply(this, arguments);
    this.value = [null, null];
    this.startDate = this.parseDate(this.startDate);
    this.endDate = this.parseDate(this.endDate);
    this.add('start', this.createStartDate());
    this.add('end', this.createEndDate());
  };

  DateRangeInput.prototype.setDisabled = function(disabled) {
    this.get('start').setDisabled(disabled);
    this.get('end').setDisabled(disabled);
  };

  DateRangeInput.prototype.setValue = function(value) {
    if (!value) {
      value = [null, null];
    }
    this.get('start').setValue(value[0]);
    this.get('end').setValue(value[1]);
    this.get('start').setRange(value[0], value[1]);
    this.get('end').setRange(value[0], value[1]);
  };

  DateRangeInput.prototype.setStartDate = function(date) {
    this.startDate = this.parseDate(date);
    this.onDateLimitsChanged();
  };

  DateRangeInput.prototype.setEndDate = function(date) {
    this.endDate = this.parseDate(date);
    this.onDateLimitsChanged();
  };

  DateRangeInput.prototype.getValue = function() {
    return [this.get('start').getValue(), this.get('end').getValue()];
  };

  DateRangeInput.prototype.getRange = function() {
    var value;
    value = this.getValue();
    return [this.parseDate(value[0]), this.parseDate(value[1])];
  };

  DateRangeInput.prototype.getInputEl = function() {
    return this.get('start').el;
  };

  DateRangeInput.prototype.getInputId = function() {
    return this.get('start').id;
  };

  DateRangeInput.prototype.createStartDate = function() {
    var input;
    input = this.createInput('start');
    input.on('changed', (function(_this) {
      return function(component, value, date) {
        _this.emit('changed', _this, _this.getValue());
        _this.get('end').setRange(date, null, true);
        _this.onDateLimitsChanged();
      };
    })(this));
    return input;
  };

  DateRangeInput.prototype.createEndDate = function() {
    var input;
    input = this.createInput('end');
    input.on('changed', (function(_this) {
      return function(component, value, date) {
        _this.emit('changed', _this, _this.getValue());
        _this.get('start').setRange(null, date, true);
        _this.onDateLimitsChanged();
      };
    })(this));
    return input;
  };

  DateRangeInput.prototype.createInput = function(type) {
    var input;
    input = new DateInput({
      id: this.id + '-' + type,
      id: this.name + '-' + type,
      cls: this.getBaseCls(type),
      rangeSelector: type,
      disabled: this.disabled,
      readonly: this.readonly,
      startDate: this.startDate,
      endDate: this.endDate,
      placeholder: this.placeholder,
      todayBtn: this.todayBtn,
      clearBtn: this.clearBtn
    });
    return input;
  };

  DateRangeInput.prototype.onDateLimitsChanged = function() {
    var range;
    range = this.getRange();
    this.get('end').setStartDate(this.startDate && this.startDate > range[0] ? this.startDate : range[0]);
    this.get('start').setEndDate(this.endDate && this.endDate < range[1] ? this.endDate : range[1]);
  };

  DateRangeInput.prototype.doRender = function() {
    this.get('start').render(this.el);
    (new Element('span', {
      cls: 'input-group-addon',
      html: miwo.tr('miwo.inputs.dateTo')
    })).inject(this.el);
    this.get('end').render(this.el);
  };

  DateRangeInput.prototype.parseDate = function(value) {
    var parts;
    if (!value) {
      return null;
    }
    if (Type.isDate(value)) {
      return value;
    }
    if (!value.match(/[0-9]{4}-[0-9]{2}-[0-9]{2}/)) {
      return null;
    }
    parts = value.split('-');
    return new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
  };

  return DateRangeInput;

})(Miwo.Container);

module.exports = DateRangeInput;


},{"./Date":73}],75:[function(require,module,exports){
var DropSelectInput,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

DropSelectInput = (function(_super) {
  __extends(DropSelectInput, _super);

  function DropSelectInput() {
    return DropSelectInput.__super__.constructor.apply(this, arguments);
  }

  DropSelectInput.prototype.xtype = 'dropselectinput';

  DropSelectInput.prototype.store = null;

  DropSelectInput.prototype.keyProperty = 'id';

  DropSelectInput.prototype.textProperty = null;

  DropSelectInput.prototype.sourceTitle = '';

  DropSelectInput.prototype.targetTitle = '';

  DropSelectInput.prototype.sourceEmpty = '';

  DropSelectInput.prototype.targetEmpty = '';

  DropSelectInput.prototype.baseCls = 'dropselect';

  DropSelectInput.prototype.afterInit = function() {
    DropSelectInput.__super__.afterInit.apply(this, arguments);
    this.store = miwo.store(this.store);
    if (!this.textProperty) {
      throw new Error("Undefined textProperty attribute");
    }
  };

  DropSelectInput.prototype.setDisabled = function(disabled) {};

  DropSelectInput.prototype.setValue = function(value, silent) {
    this.loadItems(value, silent);
  };

  DropSelectInput.prototype.getValue = function() {
    return this.getTargetKeys();
  };

  DropSelectInput.prototype.doRender = function() {
    var buttonsCls, container, listCls, source, sourceCls, target, targetCls;
    listCls = this.getBaseCls('list');
    sourceCls = this.getBaseCls('source');
    targetCls = this.getBaseCls('target');
    buttonsCls = this.getBaseCls('buttons');
    container = new Element('div', {
      parent: this.el,
      cls: 'controls row',
      html: "<div class='col-md-5'>\n	<div class='" + listCls + " " + sourceCls + "'>\n		<h5>" + this.sourceTitle + "</h4>\n		<div class=\"items\"></div>\n		<div class=\"empty\"><span>" + this.sourceEmpty + "</span></div>\n	</div>\n</div>\n<div class='col-md-2 " + buttonsCls + " text-center'>\n	<button class=\"btn btn-default\" name=\"removeAll\"> << </button>\n	<button class=\"btn btn-default\" name=\"addAll\"> >> </button>\n</div>\n<div class='col-md-5'>\n	<div class='" + listCls + " " + targetCls + "'>\n		<h5>" + this.targetTitle + "</h4>\n		<div class=\"items\"></div>\n		<div class=\"empty\"><span>" + this.targetEmpty + "</span></div>\n	</div>\n</div>"
    });
    source = container.getElement('.' + sourceCls);
    target = container.getElement('.' + targetCls);
    this.sourceEmptyCt = source.getElement('.empty');
    this.targetEmptyCt = target.getElement('.empty');
    this.sourceEl = source = source.getElement('.items');
    this.targetEl = target = target.getElement('.items');
    container.on('click:relay(.item)', (function(_this) {
      return function(event, target) {
        event.stop();
        target[target.hasClass('selected') ? 'removeClass' : 'addClass']('selected');
      };
    })(this));
    source.on('click:relay(.item)', (function(_this) {
      return function(event, item) {
        event.stop();
        _this.addItem(item);
      };
    })(this));
    target.on('click:relay(.item)', (function(_this) {
      return function(event, item) {
        event.stop();
        _this.removeItem(item);
      };
    })(this));
    target.on('click', (function(_this) {
      return function(event) {
        if (event.target.hasClass(listCls)) {
          target.getElements('.item.selected').removeClass('selected');
        }
      };
    })(this));
    source.on('click', (function(_this) {
      return function(event) {
        if (event.target.hasClass(listCls)) {
          source.getElements('.item.selected').removeClass('selected');
        }
      };
    })(this));
    container.getElement('button[name="addAll"]').on('click', (function(_this) {
      return function(e) {
        e.stop();
        _this.addAll();
      };
    })(this));
    container.getElement('button[name="removeAll"]').on('click', (function(_this) {
      return function(e) {
        e.stop();
        _this.removeAll();
      };
    })(this));
  };

  DropSelectInput.prototype.afterRender = function() {
    DropSelectInput.__super__.afterRender.apply(this, arguments);
    this.loadItems();
  };

  DropSelectInput.prototype.addItem = function(source) {
    source.inject(this.targetEl);
    source.removeClass('selected');
    this.onItemsChanged();
  };

  DropSelectInput.prototype.addAll = function() {
    var item, _i, _len, _ref;
    _ref = this.sourceEl.getElements('.item');
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      item = _ref[_i];
      item.inject(this.targetEl);
      item.removeClass('selected');
    }
    this.onItemsChanged();
  };

  DropSelectInput.prototype.addSelected = function() {
    var item, _i, _len, _ref;
    _ref = this.sourceEl.getElements('.selected');
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      item = _ref[_i];
      item.inject(this.targetEl);
      item.removeClass('selected');
    }
    this.onItemsChanged();
  };

  DropSelectInput.prototype.removeItem = function(item) {
    item.inject(this.sourceEl);
    item.removeClass('selected');
    this.onItemsChanged();
  };

  DropSelectInput.prototype.removeAll = function() {
    var item, _i, _len, _ref;
    _ref = this.targetEl.getElements('.item');
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      item = _ref[_i];
      item.inject(this.sourceEl);
      item.removeClass('selected');
    }
    this.onItemsChanged();
  };

  DropSelectInput.prototype.removeSelected = function() {
    var item, _i, _len, _ref;
    _ref = this.targetEl.getElements('.selected');
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      item = _ref[_i];
      item.inject(this.sourceEl);
      item.removeClass('selected');
    }
    this.onItemsChanged();
  };

  DropSelectInput.prototype.loadItems = function(values, silent) {
    var id, item, _i, _len, _ref;
    this.sourceEl.empty();
    this.targetEl.empty();
    this.store.each((function(_this) {
      return function(record) {
        var item;
        item = new Element('div', {
          cls: 'item',
          parent: _this.sourceEl,
          'data-id': record.get(_this.keyProperty),
          html: record.get(_this.textProperty)
        });
      };
    })(this));
    if (values) {
      _ref = this.sourceEl.getElements('.item');
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        item = _ref[_i];
        id = item.get('data-id');
        if (values.indexOf(id) >= 0) {
          item.inject(this.targetEl);
        }
      }
    }
    this.onItemsChanged(silent);
  };

  DropSelectInput.prototype.getSourceKeys = function() {
    var item, keys, _i, _len, _ref;
    keys = [];
    _ref = this.sourceEl.getElements('.item');
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      item = _ref[_i];
      keys.push(item.get('data-id'));
    }
    return keys;
  };

  DropSelectInput.prototype.getTargetKeys = function() {
    var item, keys, _i, _len, _ref;
    keys = [];
    _ref = this.targetEl.getElements('.item');
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      item = _ref[_i];
      keys.push(item.get('data-id'));
    }
    return keys;
  };

  DropSelectInput.prototype.onItemsChanged = function(silent) {
    this.sourceEmptyCt.setVisible(this.sourceEl.getElements('.item').length === 0);
    this.targetEmptyCt.setVisible(this.targetEl.getElements('.item').length === 0);
    if (!silent) {
      this.emit('change', this);
    }
  };

  return DropSelectInput;

})(Miwo.Component);

module.exports = DropSelectInput;


},{}],76:[function(require,module,exports){
var Radio,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Radio = (function(_super) {
  __extends(Radio, _super);

  function Radio() {
    return Radio.__super__.constructor.apply(this, arguments);
  }

  Radio.prototype.xtype = 'radioinput';

  Radio.prototype.isInput = true;

  Radio.prototype.checked = false;

  Radio.prototype.disabled = false;

  Radio.prototype.inputEl = null;

  Radio.prototype.iconEl = null;

  Radio.prototype.labelEl = null;

  Radio.prototype.radioName = null;

  Radio.prototype.doRender = function() {
    this.el.addClass('radio');
    this.el.set('html', '<label miwo-reference="labelEl" for="' + this.getInputId() + '">' + '<span miwo-reference="checkerEl" class="checker" tabindex="0">' + '<i miwo-reference="iconEl" class="fa"></i>' + '<input miwo-reference="inputEl" type="radio" id="' + this.getInputId() + '" name="' + this.radioName + '" value="' + this.name + '" tabindex="-1" >' + '</span>' + '<span miwo-reference="textEl" class="label-text">' + this.label + '</span>' + '</label>');
  };

  Radio.prototype.afterRender = function() {
    Radio.__super__.afterRender.apply(this, arguments);
    this.inputEl.on('change', (function(_this) {
      return function() {
        if (_this.disabled) {
          return;
        }
        _this.setChecked(_this.isChecked());
      };
    })(this));
    this.inputEl.on('focus', (function(_this) {
      return function() {
        if (_this.disabled) {
          return;
        }
        _this.setFocus();
      };
    })(this));
    this.checkerEl.on('focus', (function(_this) {
      return function() {
        if (_this.disabled) {
          return;
        }
        _this.setFocus();
      };
    })(this));
    this.checkerEl.on('keydown', (function(_this) {
      return function(e) {
        if (_this.disabled) {
          return;
        }
        if (e.key === 'space') {
          e.stop();
          _this.setChecked(!_this.isChecked());
        }
      };
    })(this));
    this.inputEl.on('blur', (function(_this) {
      return function() {
        if (_this.disabled) {
          return;
        }
        _this.emit('blur', _this);
      };
    })(this));
    this.focusEl = this.checkerEl;
    this.setDisabled(this.disabled);
    this.setChecked(this.checked);
  };

  Radio.prototype.setChecked = function(checked, silent) {
    var checkedOld;
    checkedOld = this.checked;
    this.checked = checked;
    if (!silent && checkedOld !== checked) {
      this.emit('change', this, this.name);
    }
    if (!this.rendered) {
      return;
    }
    this.el.toggleClass('checked', checked);
    this.inputEl.set('checked', checked);
    this.iconEl.removeClass('fa-dot-circle-o').removeClass('fa-circle-o');
    this.iconEl.addClass(checked ? 'fa-dot-circle-o' : 'fa-circle-o');
    return this;
  };

  Radio.prototype.isChecked = function() {
    if (this.rendered) {
      return this.inputEl.get('checked');
    } else {
      return this.checked;
    }
  };

  Radio.prototype.setDisabled = function(disabled) {
    this.disabled = disabled;
    if (!this.rendered) {
      return;
    }
    this.el.toggleClass('disabled', disabled);
    this.inputEl.set('disabled', disabled);
  };

  Radio.prototype.setLabel = function(label) {
    this.label = label;
    if (!this.rendered) {
      return;
    }
    this.textEl.set('text', label);
  };

  Radio.prototype.setValue = function(checked) {
    this.setChecked(checked);
  };

  Radio.prototype.getValue = function() {
    return this.isChecked();
  };

  Radio.prototype.getInputEl = function() {
    return this.inputEl;
  };

  Radio.prototype.getInputId = function() {
    return this.id + '-input';
  };

  return Radio;

})(Miwo.Component);

module.exports = Radio;


},{}],77:[function(require,module,exports){
var Radio, RadioListInput,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Radio = require('./Radio');

RadioListInput = (function(_super) {
  __extends(RadioListInput, _super);

  function RadioListInput() {
    return RadioListInput.__super__.constructor.apply(this, arguments);
  }

  RadioListInput.prototype.xtype = 'radiolistinput';

  RadioListInput.prototype.isInput = true;

  RadioListInput.prototype.inline = false;

  RadioListInput.prototype.radioName = null;

  RadioListInput.prototype.componentCls = 'radiolist';

  RadioListInput.prototype.setChecked = function(name) {
    this.components.each((function(_this) {
      return function(radio) {
        radio.setChecked(radio.name === name, true);
      };
    })(this));
  };

  RadioListInput.prototype.setDisabled = function(name, disabled) {
    if (Type.isString(name)) {
      this.get(name).setDisabled(disabled);
    } else {
      disabled = name;
      this.components.each((function(_this) {
        return function(checkbox) {
          checkbox.setDisabled(disabled);
        };
      })(this));
    }
  };

  RadioListInput.prototype.setValue = function(value) {
    this.components.each((function(_this) {
      return function(checkbox, name) {
        checkbox.setChecked(value === name, true);
      };
    })(this));
  };

  RadioListInput.prototype.getValue = function() {
    var value;
    value = null;
    this.components.each((function(_this) {
      return function(radio, name) {
        if (radio.isChecked() && !radio.disabled) {
          value = name;
        }
      };
    })(this));
    return value;
  };

  RadioListInput.prototype.addItem = function(name, label) {
    this.add(name, this.createRadio(name, label));
  };

  RadioListInput.prototype.createRadio = function(name, label) {
    var radio;
    radio = new Radio({
      id: this.id + '-' + name,
      name: name,
      radioName: this.radioName,
      label: label,
      cls: this.inline ? 'radio-inline' : null
    });
    radio.on('change', (function(_this) {
      return function() {
        if (_this.disabled) {
          return;
        }
        _this.setChecked(name);
        _this.emit('change');
      };
    })(this));
    radio.on('blur', (function(_this) {
      return function() {
        if (_this.disabled) {
          return;
        }
        _this.emit('blur');
      };
    })(this));
    radio.on('focus', (function(_this) {
      return function() {
        if (_this.disabled) {
          return;
        }
        _this.emit('focus');
      };
    })(this));
    return radio;
  };

  RadioListInput.prototype.clear = function() {
    this.components.each((function(_this) {
      return function(component, name) {
        _this.removeComponent(name);
        component.destroy();
      };
    })(this));
  };

  return RadioListInput;

})(Miwo.Container);

module.exports = RadioListInput;


},{"./Radio":76}],78:[function(require,module,exports){
var BaseInput, OptionGroup, SelectInput,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

BaseInput = require('./BaseInput');

OptionGroup = (function(_super) {
  __extends(OptionGroup, _super);

  OptionGroup.prototype.select = null;

  OptionGroup.prototype.label = null;

  function OptionGroup(select, config) {
    this.select = select;
    OptionGroup.__super__.constructor.call(this, config);
    this.el = new Element('optgroup', {
      label: this.label,
      parent: this.select.el
    });
    return;
  }

  OptionGroup.prototype.setLabel = function(label) {
    this.el.set('label', label);
    return this;
  };

  OptionGroup.prototype.addOption = function(value, text) {
    var option;
    option = new Element('option', {
      value: value,
      html: text
    });
    option.inject(this.el);
    return this;
  };

  return OptionGroup;

})(Miwo.Object);

SelectInput = (function(_super) {
  __extends(SelectInput, _super);

  function SelectInput() {
    return SelectInput.__super__.constructor.apply(this, arguments);
  }

  SelectInput.prototype.xtype = 'selectinput';

  SelectInput.prototype.el = 'select';

  SelectInput.prototype.componentCls = 'form-control';

  SelectInput.prototype.afterRender = function() {
    SelectInput.__super__.afterRender.call(this);
    this.el.on('change', (function(_this) {
      return function() {
        return _this.emit('change', _this, _this.getValue());
      };
    })(this));
  };

  SelectInput.prototype.addOption = function(value, text) {
    var option;
    option = new Element('option', {
      value: value,
      html: text
    });
    option.inject(this.el);
    return this;
  };

  SelectInput.prototype.addGroup = function(title) {
    return new OptionGroup(this, {
      label: title
    });
  };

  SelectInput.prototype.clear = function() {
    this.el.empty();
    return this;
  };

  SelectInput.prototype.setDisabled = function(disabled) {
    SelectInput.__super__.setDisabled.call(this, disabled);
    this.el.toggleClass('disabled', disabled);
    return this;
  };

  SelectInput.prototype.setValue = function(value) {
    this.el.set('value', value);
    return this;
  };

  SelectInput.prototype.getValue = function() {
    return this.el.get('value');
  };

  SelectInput.prototype.getInputEl = function() {
    return this.el;
  };

  return SelectInput;

})(BaseInput);

module.exports = SelectInput;


},{"./BaseInput":66}],79:[function(require,module,exports){
var SliderInput, Tooltip,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Tooltip = require('../tip/Tooltip');

SliderInput = (function(_super) {
  __extends(SliderInput, _super);

  function SliderInput() {
    return SliderInput.__super__.constructor.apply(this, arguments);
  }

  SliderInput.prototype.xtype = 'sliderinput';

  SliderInput.prototype.isInput = true;

  SliderInput.prototype.value = 0;

  SliderInput.prototype.step = 1;

  SliderInput.prototype.min = 0;

  SliderInput.prototype.max = 100;

  SliderInput.prototype.disabled = false;

  SliderInput.prototype.mode = 'slider';

  SliderInput.prototype.knobRenderer = null;

  SliderInput.prototype.selectionRenderer = null;

  SliderInput.prototype.selectionEl = null;

  SliderInput.prototype.selectionTooltip = null;

  SliderInput.prototype.trackEl = null;

  SliderInput.prototype.trackPos = null;

  SliderInput.prototype.trackSize = null;

  SliderInput.prototype.stepSize = null;

  SliderInput.prototype.knob0El = null;

  SliderInput.prototype.knob1El = null;

  SliderInput.prototype.afterInit = function() {
    SliderInput.__super__.afterInit.call(this);
    if (this.min === null || this.max === null) {
      throw new Error("min or max properties are required");
    }
    if (!Type.isArray(this.value)) {
      this.value = [0, this.value];
    }
  };

  SliderInput.prototype.doRender = function() {
    this.el.addClass('slider');
    this.el.set('html', '<div miwo-reference="trackEl" class="slider-track">' + '<div miwo-reference="selectionEl" class="slider-selection"></div>' + '<div miwo-reference="knob0El" style="display: none" class="slider-knob" tabindex="0"></div>' + '<div miwo-reference="knob1El" class="slider-knob" tabindex="0"></div>' + '</div>');
  };

  SliderInput.prototype.afterRender = function() {
    SliderInput.__super__.afterRender.call(this);
    this.selectionTooltip = new Tooltip({
      target: this.selectionEl,
      placement: 'top',
      distance: 3
    });
    this.trackEl.on('click', (function(_this) {
      return function(event) {
        if (_this.disabled) {
          return;
        }
        _this.emit('focus', _this);
        _this.setValueByEvent(event);
        _this.selectionTooltip.setText(_this.formatSelectionTooltip(_this.getValue()));
        _this.emit('change', _this, _this.getValue());
      };
    })(this));
    this.selectionEl.on('mouseenter', (function(_this) {
      return function() {
        if (_this.disabled) {
          return;
        }
        if (_this.active) {
          return;
        }
        _this.selectionTooltip.show();
        _this.selectionTooltip.setText(_this.formatSelectionTooltip(_this.getValue()));
      };
    })(this));
    this.selectionEl.on('mouseleave', (function(_this) {
      return function() {
        if (_this.disabled) {
          return;
        }
        if (_this.active) {
          return;
        }
        _this.selectionTooltip.hide();
      };
    })(this));
    this.focusEl = this.knob1El;
    this.knob0El.setVisible(this.mode === 'range');
    this.decorateKnob(this.knob0El, 0);
    this.decorateKnob(this.knob1El, 1);
    this.setValue(this.value);
    this.setDisabled(this.disabled);
    window.on('resize', this.bound('updateSlider'));
  };

  SliderInput.prototype.decorateKnob = function(knobEl, index) {
    var tooltip;
    tooltip = new Tooltip({
      target: knobEl,
      placement: 'top',
      distance: 3
    });
    knobEl.store('tooltip', tooltip);
    knobEl.store('index', index);
    knobEl.on('mousedown', (function(_this) {
      return function() {
        if (_this.disabled) {
          return;
        }
        _this.active = true;
        _this.activeKnobEl = knobEl;
        knobEl.addClass('active');
        _this.startDrag();
      };
    })(this));
    knobEl.on('keydown', (function(_this) {
      return function(e) {
        if (_this.disabled) {
          return;
        }
        switch (e.key) {
          case 'left':
            _this.decrease();
            e.stop();
            break;
          case 'down':
            _this.decrease();
            e.stop();
            break;
          case 'right':
            _this.increase();
            e.stop();
            break;
          case 'up':
            _this.increase();
            e.stop();
        }
      };
    })(this));
  };

  SliderInput.prototype.startDrag = function() {
    this.activeKnobEl.retrieve('tooltip').setText(this.formatKnobTooltip(this.getValue(this.activeKnobEl.retrieve('index')))).show();
    miwo.body.on('mousemove', this.bound('onMouseMove'));
    miwo.body.on('mouseup', this.bound('onMouseUp'));
    this.emit('focus', this);
  };

  SliderInput.prototype.stopDrag = function() {
    if (this.activeKnobEl) {
      this.activeKnobEl.retrieve('tooltip').hide();
    }
    miwo.body.un('mousemove', this.bound('onMouseMove'));
    miwo.body.un('mouseup', this.bound('onMouseUp'));
  };

  SliderInput.prototype.onMouseUp = function() {
    this.active = false;
    if (this.activeKnobEl) {
      this.activeKnobEl.removeClass('active');
    }
    this.stopDrag();
    this.onChange();
  };

  SliderInput.prototype.onChange = function() {
    this.emit('change', this, this.getValue());
  };

  SliderInput.prototype.onMouseMove = function(event) {
    this.setValueByEvent(event);
    this.activeKnobEl.retrieve('tooltip').setText(this.formatKnobTooltip(this.getValue(this.activeKnobEl.retrieve('index'))));
    this.emit('slide', this, this.getValue());
  };

  SliderInput.prototype.setValueByEvent = function(event) {
    var index, left, relativeValue, value;
    left = Math.max(0, Math.min(event.page.x - this.trackPos.x, this.trackSize.x));
    relativeValue = left / this.trackSize.x;
    value = this.min + Math.round(relativeValue * (this.max - this.min));
    if (this.mode === 'range') {
      index = value > this.value[0] + (this.value[1] - this.value[0]) / 2 ? 1 : 0;
    } else {
      index = 1;
    }
    this.setValue(value, index);
  };

  SliderInput.prototype.setValue = function(value, index) {
    var tmp;
    if (index == null) {
      index = 1;
    }
    if (Type.isArray(value)) {
      this.value[0] = this.formatValue(value[0]);
      this.value[1] = this.formatValue(value[1]);
    } else {
      this.value[index] = this.formatValue(value);
    }
    if (this.value[0] > this.value[1]) {
      tmp = this.value[0];
      this.value[0] = this.value[1];
      this.value[1] = tmp;
    }
    this.updateSlider(true);
    return this;
  };

  SliderInput.prototype.updateSlider = function(onlyValue) {
    if (!onlyValue || !this.trackPos) {
      this.trackPos = this.trackEl.getPosition();
      this.trackSize = this.trackEl.getSize();
      this.stepSize = this.trackSize.x / (this.max - this.min);
    }
    this.knob0El.setStyle('left', (this.value[0] - this.min) * this.stepSize);
    this.knob1El.setStyle('left', (this.value[1] - this.min) * this.stepSize);
    this.selectionEl.setStyle('width', ((this.value[1] - this.value[0]) - this.min) * this.stepSize);
    this.selectionEl.setStyle('left', (this.value[0] - this.min) * this.stepSize);
  };

  SliderInput.prototype.formatValue = function(value) {
    value = Math.round(value);
    if (this.step > 1) {
      value = parseInt(value / this.step) * this.step;
    }
    value = Math.min(this.max, Math.max(this.min, value));
    return value;
  };

  SliderInput.prototype.getValue = function(index) {
    if (index !== void 0) {
      return this.value[index];
    } else if (this.mode === 'range') {
      return this.value;
    } else {
      if (this.value[1] > this.value[0]) {
        return this.value[1];
      } else {
        return this.value[0];
      }
    }
  };

  SliderInput.prototype.decrease = function() {
    var index;
    if (!this.activeKnobEl) {
      return;
    }
    index = this.activeKnobEl.retrieve('index');
    this.setValue(this.value[index] - this.step, index);
    return this;
  };

  SliderInput.prototype.increase = function() {
    var index;
    if (!this.activeKnobEl) {
      return;
    }
    index = this.activeKnobEl.retrieve('index');
    this.setValue(this.value[index] + this.step, index);
    return this;
  };

  SliderInput.prototype.setDisabled = function(disabled) {
    this.disabled = disabled;
    if (!this.rendered) {
      return;
    }
    this.el.toggleClass('disabled', this.disabled);
    this.knob0El.set('tabindex', -this.disabled);
    this.knob1El.set('tabindex', -this.disabled);
    return this;
  };

  SliderInput.prototype.parentShown = function() {
    this.updateSlider();
  };

  SliderInput.prototype.formatKnobTooltip = function(value) {
    if (this.knobRenderer) {
      return this.knobRenderer(value);
    } else {
      return value;
    }
  };

  SliderInput.prototype.formatSelectionTooltip = function(value) {
    if (this.selectionRenderer) {
      return this.selectionRenderer(value);
    } else if (this.mode === 'range') {
      return "" + value[0] + " - " + value[1];
    } else {
      return value;
    }
  };

  SliderInput.prototype.doDestroy = function() {
    this.stopDrag();
    this.knob0El.retrieve('tooltip').destroy();
    this.knob1El.retrieve('tooltip').destroy();
    this.selectionTooltip.destroy();
    window.un('resize', this.bound('updateSlider'));
    return SliderInput.__super__.doDestroy.call(this);
  };

  return SliderInput;

})(Miwo.Component);

module.exports = SliderInput;


},{"../tip/Tooltip":125}],80:[function(require,module,exports){
var BaseTextInput, TextInput,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

BaseTextInput = require('./BaseTextInput');

TextInput = (function(_super) {
  __extends(TextInput, _super);

  function TextInput() {
    return TextInput.__super__.constructor.apply(this, arguments);
  }

  TextInput.prototype.type = 'text';

  TextInput.prototype.autocomplete = null;

  TextInput.prototype.doRender = function() {
    TextInput.__super__.doRender.call(this);
    this.el.set("type", this.type);
    if (this.autocomplete !== null) {
      this.el.set("autocomplete", this.autocomplete);
    }
  };

  return TextInput;

})(BaseTextInput);

module.exports = TextInput;


},{"./BaseTextInput":67}],81:[function(require,module,exports){
var BaseTextInput, TextAreaInput,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

BaseTextInput = require('./BaseTextInput');

TextAreaInput = (function(_super) {
  __extends(TextAreaInput, _super);

  function TextAreaInput() {
    return TextAreaInput.__super__.constructor.apply(this, arguments);
  }

  TextAreaInput.prototype.xtype = 'textareainput';

  TextAreaInput.prototype.el = 'textarea';

  TextAreaInput.prototype.height = null;

  TextAreaInput.prototype.resize = 'vertical';

  TextAreaInput.prototype.doRender = function() {
    TextAreaInput.__super__.doRender.call(this);
    if (this.resize) {
      this.el.setStyle("resize", this.resize);
    }
    if (this.height) {
      this.el.setStyle("height", this.height);
    }
  };

  return TextAreaInput;

})(BaseTextInput);

module.exports = TextAreaInput;


},{"./BaseTextInput":67}],82:[function(require,module,exports){
var ToggleInput,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

ToggleInput = (function(_super) {
  __extends(ToggleInput, _super);

  function ToggleInput() {
    return ToggleInput.__super__.constructor.apply(this, arguments);
  }

  ToggleInput.prototype.xtype = 'toggleinput';

  ToggleInput.prototype.isInput = true;

  ToggleInput.prototype.baseCls = 'toggle';

  ToggleInput.prototype.onState = 'success';

  ToggleInput.prototype.offState = 'default';

  ToggleInput.prototype.onText = 'ON';

  ToggleInput.prototype.offText = 'OFF';

  ToggleInput.prototype.value = false;

  ToggleInput.prototype.disabled = false;

  ToggleInput.prototype.readonly = false;

  ToggleInput.prototype.size = 'md';

  ToggleInput.prototype.beforeInit = function() {
    ToggleInput.__super__.beforeInit.apply(this, arguments);
    this.onText = miwo.tr('miwo.inputs.switchOn');
    this.offText = miwo.tr('miwo.inputs.switchOff');
  };

  ToggleInput.prototype.toggle = function() {
    this.setValue(!this.getValue());
  };

  ToggleInput.prototype.setValue = function(value, silent) {
    var oldValue;
    if (!silent) {
      this.preventChange = false;
      this.emit('beforechange', this);
      if (this.preventChange) {
        return;
      }
    }
    oldValue = this.value;
    this.value = value;
    if (this.rendered) {
      this.inputEl.set('checked', value);
      this.textEl.set('html', value ? this.onText : this.offText);
      this.el.toggleClass('toggle-on', value).toggleClass('toggle-off', !value).toggleClass('toggle-' + this.onState, value).toggleClass('toggle-' + this.offState, !value);
    }
    if (!silent && oldValue !== value) {
      this.emit('change', this, value);
    }
  };

  ToggleInput.prototype.getValue = function() {
    if (this.rendered) {
      return this.inputEl.get('checked');
    } else {
      return this.value;
    }
  };

  ToggleInput.prototype.setDisabled = function(disabled) {
    this.disabled = disabled;
    if (!this.rendered) {
      return;
    }
    this.el.toggleClass('disabled', this.disabled);
    this.el.set('tabindex', -this.disabled);
    this.inputEl.set('disabled', this.disabled);
  };

  ToggleInput.prototype.setReadonly = function(readonly) {
    this.readonly = readonly;
    if (!this.readonly) {
      return;
    }
    this.el.toggleClass('readonly', this.readonly);
  };

  ToggleInput.prototype.getInputEl = function() {
    return this.inputEl;
  };

  ToggleInput.prototype.getInputId = function() {
    return this.id + '-input';
  };

  ToggleInput.prototype.doRender = function() {
    this.el.addClass('input-' + this.size);
    this.el.addClass('form-control');
    this.el.set('tabindex', 0);
    this.el.set('html', "<div miwo-reference=\"textEl\" class='toggle-text'></div>\n<div miwo-reference=\"handleEl\" class='toggle-handle'></div>\n<input id=\"" + (this.getInputId()) + "\" type=\"checkbox\" tabindex=\"-1\" miwo-reference=\"inputEl\" class='screen-off'>");
  };

  ToggleInput.prototype.afterRender = function() {
    ToggleInput.__super__.afterRender.apply(this, arguments);
    this.el.on('click', (function(_this) {
      return function(e) {
        e.stop();
        if (_this.disabled) {
          return;
        }
        _this.toggle();
      };
    })(this));
    this.el.on('keydown', (function(_this) {
      return function(e) {
        if (_this.disabled) {
          return;
        }
        if (e.key === 'left' || e.key === 'right' || e.key === 'space') {
          e.stop();
          if (e.key === 'left') {
            _this.setValue(false);
          }
          if (e.key === 'right') {
            _this.setValue(true);
          }
          if (e.key === 'space') {
            _this.toggle();
          }
        }
      };
    })(this));
    this.inputEl.on('focus', (function(_this) {
      return function() {
        if (_this.disabled) {
          return;
        }
        _this.setFocus();
      };
    })(this));
    this.setValue(this.value, true);
    this.setDisabled(this.disabled);
    this.setReadonly(this.readonly);
  };

  return ToggleInput;

})(Miwo.Component);

module.exports = ToggleInput;


},{}],83:[function(require,module,exports){
module.exports = {
  Checkbox: require('./Checkbox'),
  Radio: require('./Radio'),
  Select: require('./Select'),
  Combo: require('./Combo'),
  Date: require('./Date'),
  DateRange: require('./DateRange'),
  Text: require('./Text'),
  Slider: require('./Slider'),
  Toggle: require('./Toggle'),
  Color: require('./Color'),
  RadioList: require('./RadioList'),
  CheckboxList: require('./CheckboxList'),
  TextArea: require('./TextArea'),
  DropSelect: require('./DropSelect'),
  Composite: require('./Composite')
};


},{"./Checkbox":68,"./CheckboxList":69,"./Color":70,"./Combo":71,"./Composite":72,"./Date":73,"./DateRange":74,"./DropSelect":75,"./Radio":76,"./RadioList":77,"./Select":78,"./Slider":79,"./Text":80,"./TextArea":81,"./Toggle":82}],84:[function(require,module,exports){
var LoadingMask,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

LoadingMask = (function(_super) {
  __extends(LoadingMask, _super);

  function LoadingMask() {
    return LoadingMask.__super__.constructor.apply(this, arguments);
  }

  LoadingMask.prototype.baseCls = 'loading-mask';

  LoadingMask.prototype.template = "<p class=\"{baseCls ct} text-center\">Loading...</p>";

  return LoadingMask;

})(Miwo.Component);

module.exports = LoadingMask;


},{}],85:[function(require,module,exports){
var LoadingMaskFactory;

LoadingMaskFactory = (function() {
  function LoadingMaskFactory() {}

  LoadingMaskFactory.prototype.instanceCls = null;

  LoadingMaskFactory.prototype.create = function(target) {
    if (target instanceof Miwo.Component) {
      target = target.el;
    }
    return new this.instanceCls({
      renderTo: target
    });
  };

  LoadingMaskFactory.prototype.show = function(target) {
    var mask;
    mask = this.create(target);
    mask.show();
    return mask;
  };

  return LoadingMaskFactory;

})();

module.exports = LoadingMaskFactory;


},{}],86:[function(require,module,exports){
module.exports = {
  LoadingMask: require('./LoadingMask'),
  LoadingMaskFactory: require('./LoadingMaskFactory')
};


},{"./LoadingMask":84,"./LoadingMaskFactory":85}],87:[function(require,module,exports){
var DropdownItem, DropdownList, Item,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Item = require('./Item');

DropdownList = require('../dropdown/List');

DropdownItem = (function(_super) {
  __extends(DropdownItem, _super);

  function DropdownItem() {
    return DropdownItem.__super__.constructor.apply(this, arguments);
  }

  DropdownItem.prototype.dropdown = null;

  DropdownItem.prototype.afterRender = function() {
    DropdownItem.__super__.afterRender.apply(this, arguments);
    this.el.set('aria-haspopup', true);
    this.el.set('aria-expanded', false);
  };

  DropdownItem.prototype.getDropdown = function() {
    if (!this.dropdown) {
      this.dropdown = new DropdownList({
        target: this.el
      });
      this.dropdown.el.set('aria-labelledby', this.id);
    }
    return this.dropdown;
  };

  DropdownItem.prototype.doRender = function() {
    var caret;
    DropdownItem.__super__.doRender.apply(this, arguments);
    caret = new Element("span", {
      cls: 'caret'
    });
    caret.inject(this.getContentEl());
  };

  DropdownItem.prototype.click = function() {
    this.getDropdown().toggle();
  };

  DropdownItem.prototype.doDestroy = function() {
    if (this.dropdown) {
      this.dropdown.destroy();
    }
    return DropdownItem.__super__.doDestroy.apply(this, arguments);
  };

  return DropdownItem;

})(Item);

module.exports = DropdownItem;


},{"../dropdown/List":18,"./Item":88}],88:[function(require,module,exports){
var NavbarItem,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

NavbarItem = (function(_super) {
  __extends(NavbarItem, _super);

  function NavbarItem() {
    return NavbarItem.__super__.constructor.apply(this, arguments);
  }

  NavbarItem.prototype.xtype = "navbaritem";

  NavbarItem.prototype.isNavbarItem = true;

  NavbarItem.prototype.handler = null;

  NavbarItem.prototype.text = "";

  NavbarItem.prototype.disabled = false;

  NavbarItem.prototype.active = false;

  NavbarItem.prototype.el = 'li';

  NavbarItem.prototype.baseCls = 'dropdown';

  NavbarItem.prototype.contentEl = 'a';

  NavbarItem.prototype.setDisabled = function(disabled, silent) {
    this.el.toggleClass('disabled', disabled);
    this.el.set('tabindex', -disabled);
    this.disabled = disabled;
    if (!silent) {
      if (disabled) {
        this.emit('disabled', this);
      } else {
        this.emit('enabled', this);
      }
    }
  };

  NavbarItem.prototype.setText = function(text) {
    this.text = text;
    if (this.textEl) {
      this.textEl.set("html", this.text);
    }
  };

  NavbarItem.prototype.setActive = function(active, silent) {
    this.el.toggleClass('active', active);
    this.active = active;
    if (!silent && active) {
      this.emit('active', this, active);
    }
  };

  NavbarItem.prototype.isActive = function() {
    return this.active && !this.disabled;
  };

  NavbarItem.prototype.click = function(e) {
    if (Type.isFunction(this.handler)) {
      this.handler(this, e);
    } else if (Type.isString(this.handler)) {
      if (this.handler.indexOf('#') === 0) {
        miwo.redirect(this.handler);
      } else {
        document.location = this.handler;
      }
    }
  };

  NavbarItem.prototype.doRender = function() {
    if (this.active) {
      this.el.addClass('active');
    }
    if (this.disabled) {
      this.el.addClass('disabled');
    }
    if (this.disabled) {
      this.el.set('tabindex', -1);
    }
    this.getContentEl().set('href', '#');
    this.getContentEl().on("click", this.bound("onClick"));
    this.textEl = new Element("span", {
      html: this.text,
      parent: this.getContentEl()
    });
  };

  NavbarItem.prototype.onClick = function(e) {
    e.preventDefault();
    if (this.disabled) {
      return;
    }
    this.preventClick = false;
    this.emit('beforeclick', this, e);
    if (this.preventClick) {
      return;
    }
    this.emit('click', this, e);
    this.click(e);
  };

  return NavbarItem;

})(Miwo.Component);

module.exports = NavbarItem;


},{}],89:[function(require,module,exports){
module.exports = {
  Item: require('./Item'),
  DropdownItem: require('./DropdownItem')
};


},{"./DropdownItem":87,"./Item":88}],90:[function(require,module,exports){
var Notification, Notificator,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Notification = window.Notification;

Notificator = (function(_super) {
  __extends(Notificator, _super);

  function Notificator() {
    return Notificator.__super__.constructor.apply(this, arguments);
  }

  Notificator.prototype.notification = null;

  Notificator.prototype.initialize = function(config) {
    Notificator.__super__.initialize.call(this, config);
    window.on("beforeunload", (function(_this) {
      return function() {
        if (_this.notification) {
          _this.notification.close();
        }
      };
    })(this));
  };

  Notificator.prototype.requestPermission = function() {
    if (Notification && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  };

  Notificator.prototype.notify = function(config) {
    var notification;
    if (!Notification || Notification.permission !== "granted") {
      return null;
    }
    notification = new Notification(config.title, {
      body: config.message,
      icon: config.icon
    });
    notification.handler = config.callback;
    notification.onclick = (function(_this) {
      return function() {
        if (config.callback) {
          config.callback();
        }
        notification.close();
      };
    })(this);
    notification.onshow = (function(_this) {
      return function() {
        if (_this.notification === notification) {
          _this.notification.close();
        }
        _this.notification = notification;
      };
    })(this);
    notification.onclose = (function(_this) {
      return function() {
        if (_this.notification === notification) {
          delete _this.notification;
        }
      };
    })(this);
    if (config.timeout) {
      setTimeout((function(_this) {
        return function() {
          notification.close();
        };
      })(this), this.timeout);
    }
    this.notification = notification;
    return notification;
  };

  return Notificator;

})(Miwo.Object);

module.exports = Notificator;


},{}],91:[function(require,module,exports){
module.exports = {
  Notificator: require('./Notificator')
};


},{"./Notificator":90}],92:[function(require,module,exports){
var Pager, Paginator,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Paginator = require('../utils/Paginator');

Pager = (function(_super) {
  __extends(Pager, _super);

  function Pager() {
    return Pager.__super__.constructor.apply(this, arguments);
  }

  Pager.prototype.el = 'nav';

  Pager.prototype.paginator = null;

  Pager.prototype.navigate = false;

  Pager.prototype.doInit = function() {
    Pager.__super__.doInit.apply(this, arguments);
    this.paginator = new Paginator();
    this.paginator.on('page', (function(_this) {
      return function() {
        if (!_this.rendered) {
          return;
        }
        _this.prevEl.toggleClass('disabled', _this.paginator.isFirst());
        _this.nextEl.toggleClass('disabled', _this.paginator.isLast());
      };
    })(this));
  };

  Pager.prototype.setStore = function(store) {
    this.store = store;
    this.mon(store, 'beforeload', (function(_this) {
      return function() {
        _this.setDisabled(true);
      };
    })(this));
    this.mon(store, 'load', (function(_this) {
      return function() {
        _this.setDisabled(false);
        _this.syncPaginator();
      };
    })(this));
    if (store.loading) {
      this.setDisabled(true);
    } else if (store.loaded) {
      this.syncPaginator();
    }
  };

  Pager.prototype.syncPaginator = function() {
    this.paginator.setItemsPerPage(this.store.pageSize);
    this.paginator.setItemCount(this.store.totalCount);
    this.paginator.setPage(this.store.page);
    this.redraw();
  };

  Pager.prototype.doRender = function() {
    var a, li, text, ul;
    ul = new Element('ul', {
      cls: 'pager'
    }).inject(this.el);
    text = '<span>' + miwo.tr('miwo.nav.prev') + '</span>';
    if (this.navigate) {
      text = '<span aria-hidden="true">&larr;</span> ' + text;
    }
    li = new Element('li').inject(ul);
    li.toggleClass('disabled', this.paginator.isFirst());
    if (this.navigate) {
      li.addClass('previous');
    }
    a = new Element('a', {
      html: text,
      href: '#',
      'data-page': 'prev',
      role: 'button'
    }).inject(li);
    this.prevEl = li;
    text = '<span>' + miwo.tr('miwo.nav.next') + '</span>';
    if (this.navigate) {
      text = text + ' <span aria-hidden="true">&rarr;</span>';
    }
    li = new Element('li').inject(ul);
    li.setStyle('padding-left', '10px');
    li.toggleClass('disabled', this.paginator.isLast());
    if (this.navigate) {
      li.addClass('next');
    }
    a = new Element('a', {
      html: text,
      href: '#',
      'data-page': 'next',
      role: 'button'
    }).inject(li);
    this.nextEl = li;
  };

  Pager.prototype.afterRender = function() {
    Pager.__super__.afterRender.apply(this, arguments);
    this.mon(this.el, 'click:relay(a)', 'onClick');
  };

  Pager.prototype.onClick = function(event, el) {
    var page;
    event.preventDefault();
    if (this.disabled) {
      return;
    }
    if (el.getParent('li').hasClass('disabled')) {
      return;
    }
    page = el.get('data-page');
    this.emit('page', this, page);
    if (this.store) {
      this.store.loadNestedPage(page);
    }
  };

  Pager.prototype.doDestroy = function() {
    this.paginator.destroy();
    return Pager.__super__.doDestroy.apply(this, arguments);
  };

  return Pager;

})(Miwo.Component);

module.exports = Pager;


},{"../utils/Paginator":130}],93:[function(require,module,exports){
var PagerInfo,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

PagerInfo = (function(_super) {
  __extends(PagerInfo, _super);

  function PagerInfo() {
    return PagerInfo.__super__.constructor.apply(this, arguments);
  }

  PagerInfo.prototype.xtype = 'pagerinfo';

  PagerInfo.prototype.el = 'p';

  PagerInfo.prototype.baseCls = 'pager-info';

  PagerInfo.prototype.setStore = function(store) {
    this.store = store;
    this.mon(store, 'load', (function(_this) {
      return function() {
        if (_this.rendered) {
          _this.redraw();
        }
      };
    })(this));
    if (this.rendered && store.loaded) {
      this.redraw();
    }
  };

  PagerInfo.prototype.doRender = function() {
    var from, store, to;
    store = this.store;
    from = (store.page - 1) * store.pageSize;
    to = Math.min(store.totalCount, from + store.pageSize);
    this.el.set('html', miwo.tr('miwo.pagination.pageInfo').substitute({
      visible: from + ' - ' + to,
      total: store.totalCount
    }));
  };

  return PagerInfo;

})(Miwo.Component);

module.exports = PagerInfo;


},{}],94:[function(require,module,exports){
var Paginator, UtilPaginator,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

UtilPaginator = require('../utils/Paginator');

Paginator = (function(_super) {
  __extends(Paginator, _super);

  function Paginator() {
    return Paginator.__super__.constructor.apply(this, arguments);
  }

  Paginator.prototype.nestedCount = 2;

  Paginator.prototype.remoteCount = 2;

  Paginator.prototype.size = null;

  Paginator.prototype.el = 'nav';

  Paginator.prototype.paginator = null;

  Paginator.prototype.doInit = function() {
    Paginator.__super__.doInit.apply(this, arguments);
    this.paginator = new UtilPaginator();
    this.paginator.on('page', (function(_this) {
      return function() {
        if (!_this.rendered) {
          return;
        }
        _this.renderPages();
      };
    })(this));
  };

  Paginator.prototype.setStore = function(store) {
    this.store = store;
    this.mon(store, 'beforeload', (function(_this) {
      return function() {
        _this.setDisabled(true);
      };
    })(this));
    this.mon(store, 'load', (function(_this) {
      return function() {
        _this.setDisabled(false);
        _this.syncPaginator();
      };
    })(this));
    if (store.loading) {
      this.setDisabled(true);
    } else if (store.loaded) {
      this.syncPaginator();
    }
  };

  Paginator.prototype.syncPaginator = function() {
    this.paginator.setItemsPerPage(this.store.pageSize);
    this.paginator.setItemCount(this.store.totalCount);
    this.paginator.setPage(this.store.page);
    this.redraw();
  };

  Paginator.prototype.doRender = function() {
    var a, i, li, max, min, quotient, step, steps, text, ul, _i, _j, _k, _len, _ref, _results;
    this.el.empty();
    if (this.paginator.itemCount === null) {
      return;
    }
    if (this.paginator.getPageCount() < 2) {
      return;
    }
    min = Math.max(this.paginator.getFirstPage(), this.page - this.nestedCount);
    max = Math.min(this.paginator.getLastPage(), this.page + this.nestedCount);
    steps = (function() {
      _results = [];
      for (var _i = min; min <= max ? _i <= max : _i >= max; min <= max ? _i++ : _i--){ _results.push(_i); }
      return _results;
    }).apply(this);
    quotient = (this.paginator.getPageCount() - 1) / this.remoteCount;
    for (i = _j = 0, _ref = this.remoteCount; 0 <= _ref ? _j <= _ref : _j >= _ref; i = 0 <= _ref ? ++_j : --_j) {
      steps.include(Math.round(quotient * i) + this.paginator.getFirstPage());
    }
    steps.sort(function(a, b) {
      return a - b;
    });
    ul = new Element('ul', {
      cls: 'pagination'
    }).inject(this.el);
    if (this.size) {
      ul.addClass('pagination-' + this.size);
    }
    text = '<span class="sr-only">' + miwo.tr('miwo.nav.prev') + '</span><span aria-hidden="true">&laquo;</span>';
    li = new Element('li').inject(ul);
    a = new Element('a', {
      html: text,
      href: '#',
      'data-page': 1,
      role: 'button'
    }).inject(li);
    if (this.paginator.isFirst()) {
      li.addClass('disabled');
    }
    for (_k = 0, _len = steps.length; _k < _len; _k++) {
      step = steps[_k];
      li = new Element('li').inject(ul);
      if (step === this.page) {
        li.addClass('active');
      }
      text = '<span>' + step + '</span>';
      if (step === this.page) {
        text = step + '<span class="sr-only">(' + miwo.tr('miwo.nav.current') + ')</span>';
      }
      a = new Element('a', {
        html: text,
        href: '#',
        'data-page': step,
        role: 'button'
      }).inject(li);
    }
    text = '<span aria-hidden="true">&raquo;</span><span class="sr-only">' + miwo.tr('miwo.nav.next') + '</span>';
    li = new Element('li').inject(ul);
    a = new Element('a', {
      html: text,
      href: '#',
      'data-page': this.paginator.getLastPage(),
      role: 'button'
    }).inject(li);
    if (this.paginator.isLast()) {
      li.addClass('disabled');
    }
  };

  Paginator.prototype.afterRender = function() {
    Paginator.__super__.afterRender.apply(this, arguments);
    this.mon(this.el, 'click:relay(a)', 'onClick');
  };

  Paginator.prototype.onClick = function(event, el) {
    var page;
    event.preventDefault();
    if (this.disabled) {
      return;
    }
    if (el.getParent('li').hasClass('disabled')) {
      return;
    }
    page = parseInt(el.get('data-page'));
    this.emit('page', this, page);
    if (this.store) {
      this.store.loadPage(page);
    }
  };

  return Paginator;

})(Miwo.Component);

module.exports = Paginator;


},{"../utils/Paginator":130}],95:[function(require,module,exports){
module.exports = {
  Paginator: require('./Paginator'),
  Pager: require('./Pager'),
  PagerInfo: require('./PagerInfo')
};


},{"./Pager":92,"./PagerInfo":93,"./Paginator":94}],96:[function(require,module,exports){
var Pane, Scrollable,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Scrollable = require('./Scrollable');

Pane = (function(_super) {
  __extends(Pane, _super);

  function Pane() {
    return Pane.__super__.constructor.apply(this, arguments);
  }

  Pane.prototype.scrollable = false;

  Pane.prototype.scrollableOptions = null;

  Pane.prototype.contentEl = 'div';

  Pane.prototype.doInit = function() {
    Pane.__super__.doInit.apply(this, arguments);
    this.setScrollable(this.scrollable);
  };

  Pane.prototype.setScrollable = function(scrollable) {
    this.scrollable = scrollable;
    if (this.scrollable && !this.hasPlugin('scrollable')) {
      this.installPlugin('scrollable', new Scrollable(this, this.scrollableOptions));
    } else if (!this.scrollable && this.hasPlugin('scrollable')) {
      this.uninstallPlugin('scrollable');
    }
  };

  Pane.prototype.scrollTop = function() {
    if (this.scrollable) {
      this.getPlugin('scrollable').scrollTop();
    }
  };

  Pane.prototype.scrollBottom = function() {
    if (this.scrollable) {
      this.getPlugin('scrollable').scrollBottom();
    }
  };

  Pane.prototype.afterRender = function() {
    Pane.__super__.afterRender.apply(this, arguments);
    this.el.addClass('pane');
    this.contentEl.addClass('pane-ct');
  };

  return Pane;

})(Miwo.Container);

module.exports = Pane;


},{"./Scrollable":97}],97:[function(require,module,exports){
var Scrollable, Slider,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Slider = require('../drag/Slider');

Scrollable = (function(_super) {
  __extends(Scrollable, _super);

  Scrollable.prototype.fade = true;

  Scrollable.prototype.autoHide = true;

  Scrollable.prototype.proportional = true;

  Scrollable.prototype.proportionalMinHeight = 15;

  function Scrollable(container, config) {
    this.container = container;
    Scrollable.__super__.constructor.call(this, config);
    return;
  }

  Scrollable.prototype.scrollTop = function() {
    this.scrollableBody.scrollTop = 0;
    this.actualize();
  };

  Scrollable.prototype.scrollBottom = function() {
    this.scrollableBody.scrollTop = this.scrollableBody.scrollHeight;
    this.actualize();
  };

  Scrollable.prototype.afterRender = function() {
    this.container.el.addClass('scrollable');
    this.scrollableCt = this.container.scrollableCt || this.container.el;
    this.scrollableBody = this.container.scrollableEl || this.container.getContentEl();
    this.scrollableCt.addClass('scrollable-ct');
    this.scrollableBody.addClass('scrollable-body');
    this.scrollbar = new Element('div', {
      parent: this.scrollableCt,
      cls: 'scrollable-slider'
    });
    this.scrollbar.set('tween', {
      duration: 50
    });
    this.knob = new Element('div', {
      parent: this.scrollbar,
      cls: 'scrollable-knob'
    });
    this.slider = new Slider(this.scrollbar, this.knob, {
      mode: 'vertical'
    });
    this.slider.on('change', (function(_this) {
      return function(step) {
        _this.scrollableBody.scrollTop = (_this.scrollableBody.scrollHeight - _this.scrollableBody.offsetHeight) * step / 100;
      };
    })(this));
    this.scrollableCt.on('mouseenter', this.bound('onElementMouseEnter'));
    this.scrollableCt.on('mouseleave', this.bound('onElementMouseLeave'));
    this.scrollableCt.on('mousewheel', this.bound('onElementMouseWheel'));
    this.scrollableBody.on('Scrollable:contentHeightChange', this.bound('onContentHeightChange'));
    this.knob.on('mousedown', this.bound('onKnobMouseDown'));
    window.on('resize', this.bound('onWindowResize'));
    window.on('mousewheel', this.bound('onWindowMouseWheel'));
    this.scrollbar.fade('show');
    if (this.autoHide) {
      this.scrollbar.fade('hide');
    }
    this.actualize();
  };

  Scrollable.prototype.onElementMouseEnter = function() {
    if (this.scrollableBody.scrollHeight > this.scrollableCt.offsetHeight) {
      this.showContainer();
    }
    this.actualize();
  };

  Scrollable.prototype.onElementMouseLeave = function(e) {
    if (!this.active) {
      this.hideContainer();
    }
  };

  Scrollable.prototype.onElementMouseWheel = function(e) {
    var el;
    e.preventDefault();
    el = this.scrollableBody;
    if (e.wheel < 0 && el.scrollTop < el.scrollHeight - el.offsetHeight || e.wheel > 0 && el.scrollTop > 0) {
      el.scrollTop = el.scrollTop - e.wheel * 30;
      this.actualize();
    }
  };

  Scrollable.prototype.onContentHeightChange = function() {
    this.container.emit('heightchange', this.container);
  };

  Scrollable.prototype.onKnobMouseDown = function() {
    this.active = true;
    window.on('mouseup', this.bound('onWindowMouseUp'));
  };

  Scrollable.prototype.onWindowMouseUp = function(e) {
    this.active = false;
    window.un('mouseup', this.bound('onWindowMouseUp'));
  };

  Scrollable.prototype.onWindowResize = function() {
    this.actualize.delay(50, this);
  };

  Scrollable.prototype.onWindowMouseWheel = function() {
    if (this.scrollableBody.isVisible()) {
      this.actualize();
    }
  };

  Scrollable.prototype.actualize = function() {
    var diff, el, knobHeight, minHeight, pos;
    el = this.scrollableBody;
    setTimeout((function(_this) {
      return function() {
        _this.size = el.getSize();
        _this.position = el.getPosition();
        _this.slider.updateSize();
      };
    })(this), 50);
    if (this.proportional) {
      if (isNaN(this.proportionalMinHeight) || this.proportionalMinHeight <= 0) {
        throw new Error('Miwo.panel.Scrollpane::reposition(): option "proportionalMinHeight" is not a positive number.');
      } else {
        minHeight = Math.abs(this.proportionalMinHeight);
        knobHeight = el.scrollHeight !== 0 ? el.offsetHeight * (el.offsetHeight / el.scrollHeight) : 0;
        this.knob.setStyle('height', Math.max(knobHeight, minHeight));
      }
    }
    diff = el.scrollHeight - el.offsetHeight;
    pos = diff ? Math.round(el.scrollTop / diff * 100) : 0;
    this.slider.setStep(pos);
  };

  Scrollable.prototype.showContainer = function(force) {
    if (this.autoHide && this.fade && !this.active || force && this.fade) {
      this.scrollbar.fade(0.6);
    } else if (this.autoHide && !this.fade && !this.active || force && !this.fade) {
      this.scrollbar.fade('show');
    }
  };

  Scrollable.prototype.hideContainer = function(force) {
    if (this.autoHide && this.fade && !this.active || force && this.fade) {
      this.scrollbar.fade('out');
    } else if (this.autoHide && !this.fade && !this.active || force && !this.fade) {
      this.scrollbar.fade('hide');
    }
  };

  Scrollable.prototype.doDestroy = function() {
    window.un('resize', this.bound('onWindowResize'));
    window.un('mousewheel', this.bound('onWindowMouseWheel'));
    this.scrollbar.destroy();
    return Scrollable.__super__.doDestroy.apply(this, arguments);
  };

  return Scrollable;

})(Miwo.Object);

module.exports = Scrollable;


},{"../drag/Slider":13}],98:[function(require,module,exports){
module.exports = {
  Pane: require('./Pane'),
  Scrollable: require('./Scrollable')
};


},{"./Pane":96,"./Scrollable":97}],99:[function(require,module,exports){
var BaseDatePicker,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

BaseDatePicker = (function(_super) {
  __extends(BaseDatePicker, _super);

  function BaseDatePicker() {
    return BaseDatePicker.__super__.constructor.apply(this, arguments);
  }

  BaseDatePicker.prototype.startDate = null;

  BaseDatePicker.prototype.endDate = null;

  BaseDatePicker.prototype.selectedDate = null;

  BaseDatePicker.prototype.activeDate = null;

  BaseDatePicker.prototype.focusedDate = null;

  BaseDatePicker.prototype.componentCls = 'datepicker';

  BaseDatePicker.prototype.moveIndex = null;

  BaseDatePicker.prototype.items = null;

  BaseDatePicker.prototype.doInit = function() {
    BaseDatePicker.__super__.doInit.apply(this, arguments);
    this.setActiveDate(this.activeDate || new Date());
    if (this.startDate) {
      this.setStartDate(this.startDate);
    }
    if (this.endDate) {
      this.setEndDate(this.endDate);
    }
  };

  BaseDatePicker.prototype.setStartDate = function(startDate) {
    this.startDate = startDate ? new Date(startDate.getFullYear(), startDate.getMonth(), 1) : null;
  };

  BaseDatePicker.prototype.setEndDate = function(endDate) {
    this.endDate = endDate ? new Date(endDate.getFullYear(), endDate.getMonth() + 1, 0) : null;
  };

  BaseDatePicker.prototype.setActiveDate = function(activeDate) {
    this.activeDate = new Date(activeDate.getTime());
    this.activeDate.setDate(1);
  };

  BaseDatePicker.prototype.setDate = function(date, silent) {
    if (date) {
      this.select(date, silent);
      this.activate(date);
    } else {
      this.select(null, silent);
      this.activate(new Date());
    }
  };

  BaseDatePicker.prototype.getDate = function() {
    return this.selectedDate;
  };

  BaseDatePicker.prototype.setFocus = function() {
    if (this.panel) {
      this.panel.setFocus();
    }
  };

  BaseDatePicker.prototype.select = function(date, silent) {
    if (date) {
      this.selectedDate = new Date(date.getTime());
      this.focusedDate = new Date(date.getTime());
      this.updateCalendar();
    } else {
      this.selectedDate = null;
      this.focusedDate = null;
      this.updateCalendar();
    }
    if (!silent) {
      this.emit('selected', this, this.selectedDate);
    }
    this.onSelected(this.selectedDate, silent);
  };

  BaseDatePicker.prototype.onSelected = function(date, silent) {};

  BaseDatePicker.prototype.activate = function(year, month) {
    if (Type.isDate(year)) {
      month = year.getMonth();
      year = year.getFullYear();
    }
    if (month !== void 0 && month !== null) {
      this.activeDate.setMonth(month);
    }
    if (year !== void 0 && year !== null) {
      this.activeDate.setFullYear(year);
    }
    this.renderCalendar();
  };

  BaseDatePicker.prototype.isDayEnabled = function(date) {
    if (this.startDate && this.endDate) {
      return date >= this.startDate && date <= this.endDate;
    } else if (this.startDate) {
      return date >= this.startDate;
    } else if (date <= this.endDate) {
      return true;
    } else {
      return true;
    }
  };

  BaseDatePicker.prototype.formatYear = function(date) {
    return date.getFullYear();
  };

  BaseDatePicker.prototype.formatMonth = function(date) {
    if (date.format) {
      return date.format('B');
    } else {
      return date.toString().split(' ')[1];
    }
  };

  BaseDatePicker.prototype.doRender = function() {
    this.renderPanel();
  };

  BaseDatePicker.prototype.renderPanel = function() {
    this.panel = new Element('table', {
      cls: 'table-condensed datepicker-panel',
      tabindex: -1,
      parent: this.el,
      html: '<thead></thead><tbody></tbody>'
    });
    this.renderHeader();
    this.renderCalendar();
  };

  BaseDatePicker.prototype.renderHeader = function() {
    var tr;
    tr = new Element('tr', {
      html: '<tr>' + '<th class="prev">«</th>' + '<th class="switch" colspan="2"></th>' + '<th class="next">»</th>' + '</tr>'
    });
    tr.inject(this.getElement('thead'));
  };

  BaseDatePicker.prototype.renderCalendar = function() {};

  BaseDatePicker.prototype.updateCalendar = function() {};

  BaseDatePicker.prototype.afterRender = function() {
    BaseDatePicker.__super__.afterRender.apply(this, arguments);
    this.panel.getElement('.prev').on('click', (function(_this) {
      return function() {
        _this.activatePrev();
      };
    })(this));
    this.panel.getElement('.next').on('click', (function(_this) {
      return function() {
        _this.activateNext();
      };
    })(this));
    this.panel.getElement('.switch').on('click', (function(_this) {
      return function() {
        _this.emit('switch', _this);
      };
    })(this));
    this.panel.on('click:relay(tbody td)', (function(_this) {
      return function(event, target) {
        var item;
        if (!target.hasClass('disabled')) {
          item = _this.items[target.get('data-index')];
          _this.select(item.date);
          if (item.foreign) {
            _this.activate(item.date);
          }
        }
      };
    })(this));
    this.panel.on('mouseenter:relay(tbody td)', (function(_this) {
      return function(event, target) {
        var item;
        item = _this.items[target.get('data-index')];
        if (_this.isDayEnabled(item.date)) {
          _this.focusedIndex = item.index;
          _this.focusedDate = new Date(item.date);
          _this.updateCalendar();
        }
      };
    })(this));
    this.keyListener = new Miwo.utils.KeyListener(this.panel, 'keydown');
    this.keyListener.pause();
    this.keyListener.on('up', (function(_this) {
      return function() {
        _this.tryMoveFocus(_this.moveIndex.up);
        return true;
      };
    })(this));
    this.keyListener.on('down', (function(_this) {
      return function() {
        _this.tryMoveFocus(_this.moveIndex.down);
        return true;
      };
    })(this));
    this.keyListener.on('left', (function(_this) {
      return function() {
        _this.tryMoveFocus(_this.moveIndex.left);
        return true;
      };
    })(this));
    this.keyListener.on('right', (function(_this) {
      return function() {
        _this.tryMoveFocus(_this.moveIndex.right);
        return true;
      };
    })(this));
    this.keyListener.on('enter', (function(_this) {
      return function() {
        var item;
        item = _this.items[_this.focusedIndex];
        _this.select(item.date);
        if (!item.foreign) {
          _this.activate(item.date);
        }
        return true;
      };
    })(this));
    if (!this.focusedDate) {
      if (this.selectedDate) {
        this.focusedDate = new Date(this.selectedDate.getTime());
      } else {
        this.focusedDate = new Date(this.activeDate.getTime());
      }
    }
    if (this.selectedDate) {
      this.activate(this.selectedDate);
    }
  };

  BaseDatePicker.prototype.doShow = function() {
    BaseDatePicker.__super__.doShow.apply(this, arguments);
    if (this.keyListener) {
      this.keyListener.resume();
    }
  };

  BaseDatePicker.prototype.doHide = function() {
    BaseDatePicker.__super__.doHide.apply(this, arguments);
    if (this.keyListener) {
      this.keyListener.pause();
    }
  };

  BaseDatePicker.prototype.doDestroy = function() {
    if (this.keyListener) {
      this.keyListener.destroy();
    }
    return BaseDatePicker.__super__.doDestroy.apply(this, arguments);
  };

  return BaseDatePicker;

})(Miwo.Component);

module.exports = BaseDatePicker;


},{}],100:[function(require,module,exports){
var Color, ColorPicker,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Color = require('../utils/Color');

ColorPicker = (function(_super) {
  __extends(ColorPicker, _super);

  function ColorPicker() {
    return ColorPicker.__super__.constructor.apply(this, arguments);
  }

  ColorPicker.prototype.xtype = "colorpicker";

  ColorPicker.prototype.color = "FFFFFF";

  ColorPicker.prototype.mapColor = null;

  ColorPicker.prototype.colorRe = /^[0-9A-F]{6}$/;

  ColorPicker.prototype.baseCls = 'colorpicker';

  ColorPicker.prototype.beforeInit = function() {
    ColorPicker.__super__.beforeInit.call(this);
    this.template = '<div miwo-reference="map" class="{baseCls map}">' + '<div class="{baseCls panel}"></div>' + '<div miwo-reference="point" class="{baseCls point}"></div>' + '</div>' + '<div class="{baseCls bar}">' + '<div miwo-reference="bar" class="bar"></div>' + '</div>' + '<div class="{baseCls utils}">' + '<div miwo-reference="preview" class="{baseCls preview}"></div>' + '<input miwo-reference="hexinput" type="text" class="{baseCls hex} form-control" maxlength="7" value="FFFFFF"/>' + '<button miwo-events="click:onBtnClick" class="btn btn-default">Select</button>' + '</div>';
  };

  ColorPicker.prototype.afterInit = function() {
    ColorPicker.__super__.afterInit.call(this);
    this.color = Color.fromHex(this.color);
    this.mapColor = Color.fromHsv(this.color.hue, 100, 100);
  };

  ColorPicker.prototype.afterRender = function() {
    ColorPicker.__super__.afterRender.call(this);
    this.hexinput.on("keyup", (function(_this) {
      return function() {
        _this.setColor(_this.hexinput.get("value"));
      };
    })(this));
    this.map.on("mousedown", (function(_this) {
      return function(event) {
        event.stop();
        document.on("mousemove", _this.bound("onMapMouseMove"));
        document.on("mouseup", _this.bound("onMapMouseUp"));
      };
    })(this));
    this.map.on("click", (function(_this) {
      return function(event) {
        event.stop();
        _this.updateMapOnMouseEvent(event);
      };
    })(this));
    this.bar.on("mousedown", (function(_this) {
      return function(event) {
        event.stop();
        document.on("mousemove", _this.bound("onBarMouseMove"));
        document.on("mouseup", _this.bound("onBarMouseUp"));
      };
    })(this));
    this.bar.on("click", (function(_this) {
      return function(event) {
        event.stop();
        _this.updateBarOnMouseEvent(event);
      };
    })(this));
    this.setColor(this.color.hex, true, true);
  };

  ColorPicker.prototype.setColor = function(color, update, silent) {
    color = color.toUpperCase();
    color = color.replace("#", "");
    if (this.isColorValid(color) && (this.color.hex !== color || update)) {
      this.color.setHex(color);
      this.mapColor = Color.fromHsv(this.color.hue, 100, 100);
      this.doSetHue(this.color.h);
      this.doSetSaturationAndValue(this.color.s, this.color.v);
      this.color.setHex(color);
      this.onColorChanged(silent);
    }
  };

  ColorPicker.prototype.getColor = function() {
    return this.color.hex;
  };

  ColorPicker.prototype.isColorValid = function(hex) {
    return this.colorRe.test(hex);
  };

  ColorPicker.prototype.onBarMouseUp = function(event) {
    event.stop();
    document.un("mousemove", this.bound("onBarMouseMove"));
    document.un("mouseup", this.bound("onBarMouseUp"));
  };

  ColorPicker.prototype.onBarMouseMove = function(event) {
    event.stop();
    this.updateBarOnMouseEvent(event);
  };

  ColorPicker.prototype.updateBarOnMouseEvent = function(e) {
    var pos, yValue;
    pos = this.bar.getPosition();
    yValue = Math.min(Math.max(0, e.page.y - pos.y), 256);
    this.setHue(360 - Math.round((360 / 256) * yValue));
  };

  ColorPicker.prototype.setHue = function(hue) {
    if (this.color.hue !== hue) {
      this.doSetHue(hue);
      this.onColorChanged();
    }
  };

  ColorPicker.prototype.doSetHue = function(hue) {
    this.color.setHsv(hue, null, null);
    this.mapColor.setHsv(hue, 100, 100);
    this.map.setStyle("background-color", "#" + this.mapColor.hex);
  };

  ColorPicker.prototype.onMapMouseUp = function(event) {
    event.stop();
    document.un("mousemove", this.bound("onMapMouseMove"));
    document.un("mouseup", this.bound("onMapMouseUp"));
  };

  ColorPicker.prototype.onMapMouseMove = function(event) {
    event.stop();
    this.updateMapOnMouseEvent(event);
  };

  ColorPicker.prototype.updateMapOnMouseEvent = function(event) {
    var pos, s, v, xValue, yValue;
    pos = this.map.getPosition();
    xValue = Math.min(Math.max(0, event.page.x - pos.x), 256);
    yValue = Math.min(Math.max(0, event.page.y - pos.y), 256);
    s = Math.round((100 / 256) * xValue);
    v = 100 - Math.round((100 / 256) * yValue);
    this.setSaturationAndValue(s, v);
  };

  ColorPicker.prototype.setSaturationAndValue = function(s, v) {
    if (this.color.s !== s || this.color.v !== v) {
      this.doSetSaturationAndValue(s, v);
      this.onColorChanged();
    }
  };

  ColorPicker.prototype.doSetSaturationAndValue = function(s, v) {
    this.color.setHsv(null, s, v);
    this.point.setPosition({
      x: (s / 100) * 256 - 8,
      y: 256 - (v / 100) * 256 - 8
    });
  };

  ColorPicker.prototype.onColorChanged = function(silent) {
    this.preview.setStyle("background-color", "#" + this.color.hex);
    this.hexinput.set("value", this.color.hex);
    if (!silent) {
      this.emit("changed", this, this.color.hex);
    }
  };

  ColorPicker.prototype.onBtnClick = function() {
    this.emit("selected", this, this.color.hex);
  };

  return ColorPicker;

})(Miwo.Component);

module.exports = ColorPicker;


},{"../utils/Color":129}],101:[function(require,module,exports){
var DatePicker, DayPicker, MonthPicker, YearPicker,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

DayPicker = require('./Day');

MonthPicker = require('./Month');

YearPicker = require('./Year');

DatePicker = (function(_super) {
  __extends(DatePicker, _super);

  function DatePicker() {
    return DatePicker.__super__.constructor.apply(this, arguments);
  }

  DatePicker.prototype.startDate = null;

  DatePicker.prototype.endDate = null;

  DatePicker.prototype.selectedDate = null;

  DatePicker.prototype.rangeStart = null;

  DatePicker.prototype.rangeEnd = null;

  DatePicker.prototype.rangeSelector = 'end';

  DatePicker.prototype.todayBtn = false;

  DatePicker.prototype.clearBtn = false;

  DatePicker.prototype.doInit = function() {
    DatePicker.__super__.doInit.apply(this, arguments);
    this.componentCls = 'datepicker';
    this.activeDate = new Date();
    this.activeDate.setDate(1);
    this.add('day', this.createComponentDay());
    this.add('month', this.createComponentMonth());
    this.add('year', this.createComponentYear());
  };

  DatePicker.prototype.createComponentDay = function() {
    var picker;
    picker = new DayPicker({
      visible: false,
      activeDate: this.activeDate,
      startDate: this.startDate,
      endDate: this.endDate,
      selectedDate: this.selectedDate,
      rangeStart: this.rangeStart,
      rangeEnd: this.rangeEnd,
      rangeSelector: this.rangeSelector
    });
    picker.on('switch', (function(_this) {
      return function() {
        picker.hide();
        _this.get('month').activate(picker.activeDate);
        _this.get('month').select(picker.selectedDate, true);
        _this.get('month').show();
        _this.emit('switch', _this, 'month');
      };
    })(this));
    picker.on('selected', (function(_this) {
      return function(picker, date) {
        _this.emit('selected', _this, date);
      };
    })(this));
    return picker;
  };

  DatePicker.prototype.createComponentMonth = function() {
    var picker;
    picker = new MonthPicker({
      visible: false,
      activeDate: this.activeDate,
      startDate: this.startDate,
      endDate: this.endDate,
      selectedDate: this.selectedDate
    });
    picker.on('switch', (function(_this) {
      return function() {
        picker.hide();
        _this.get('year').show();
        _this.emit('switch', _this, 'year');
      };
    })(this));
    picker.on('selected', (function(_this) {
      return function() {
        picker.hide();
        _this.get('day').activate(picker.selectedDate);
        _this.get('day').show();
        _this.emit('switch', _this, 'day');
      };
    })(this));
    return picker;
  };

  DatePicker.prototype.createComponentYear = function() {
    var picker;
    picker = new YearPicker({
      visible: false,
      activeDate: this.activeDate,
      startDate: this.startDate,
      endDate: this.endDate,
      selectedDate: this.selectedDate
    });
    picker.on('selected', (function(_this) {
      return function() {
        picker.hide();
        _this.get('month').activate(picker.selectedDate);
        _this.get('month').show();
        _this.emit('switch', _this, 'month');
      };
    })(this));
    return picker;
  };

  DatePicker.prototype.activate = function(year, month) {
    this.get('day').activate(year, month);
  };

  DatePicker.prototype.select = function(date, silent) {
    this.get('day').select(date, silent);
  };

  DatePicker.prototype.setDate = function(date, silent) {
    this.get('day').setDate(date, silent);
  };

  DatePicker.prototype.setStartDate = function(date) {
    this.getComponents().each(function(picker) {
      return picker.setStartDate(date);
    });
  };

  DatePicker.prototype.setEndDate = function(date) {
    this.getComponents().each(function(picker) {
      return picker.setEndDate(date);
    });
  };

  DatePicker.prototype.setRange = function(rangeStart, rangeEnd, silent) {
    this.get('day').setRange(rangeStart, rangeEnd, silent);
  };

  DatePicker.prototype.setTodayBtn = function(todayBtn) {
    this.todayBtn = todayBtn;
    if (this.rendered) {
      this.getElement('.todayBtn').setVisible(this.todayBtn);
    }
  };

  DatePicker.prototype.setClearBtn = function(clearBtn) {
    this.clearBtn = clearBtn;
    if (this.rendered) {
      this.getElement('.clearBtn').setVisible(this.clearBtn);
    }
  };

  DatePicker.prototype.getDate = function() {
    return this.get('day').getDate();
  };

  DatePicker.prototype.setType = function(type) {
    if (type == null) {
      type = 'date';
    }
    this.type = type;
  };

  DatePicker.prototype.setFocus = function() {
    this.get('day').setFocus();
  };

  DatePicker.prototype.doRender = function() {
    var table, tbody, td, tr;
    DatePicker.__super__.doRender.apply(this, arguments);
    table = new Element('table', {
      parent: this.el,
      cls: 'table-condensed datepicker-footer'
    });
    tbody = new Element('tbody', {
      parent: table
    });
    tr = new Element('tr', {
      parent: tbody
    });
    td = new Element('td', {
      html: miwo.tr('miwo.picker.today'),
      cls: 'todayBtn',
      parent: tr
    });
    td.setVisible(this.todayBtn);
    td = new Element('td', {
      html: miwo.tr('miwo.picker.clear'),
      cls: 'clearBtn',
      parent: tr
    });
    td.setVisible(this.clearBtn);
  };

  DatePicker.prototype.afterRender = function() {
    DatePicker.__super__.afterRender.apply(this, arguments);
    this.get('day').show();
    this.getElement('.todayBtn').on('click', (function(_this) {
      return function() {
        return _this.setDate(new Date());
      };
    })(this));
    this.getElement('.clearBtn').on('click', (function(_this) {
      return function() {
        return _this.setDate(null);
      };
    })(this));
  };

  return DatePicker;

})(Miwo.Container);

module.exports = DatePicker;


},{"./Day":102,"./Month":103,"./Year":106}],102:[function(require,module,exports){
var BaseDatePicker, DayPicker,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

BaseDatePicker = require('./BaseDate');

DayPicker = (function(_super) {
  __extends(DayPicker, _super);

  function DayPicker() {
    return DayPicker.__super__.constructor.apply(this, arguments);
  }

  DayPicker.prototype.xtype = "daypicker";

  DayPicker.prototype.baseCls = 'daypicker';

  DayPicker.prototype.rangeStart = null;

  DayPicker.prototype.rangeEnd = null;

  DayPicker.prototype.rangeSelector = null;

  DayPicker.prototype.beforeInit = function() {
    DayPicker.__super__.beforeInit.apply(this, arguments);
    this.moveIndex = {
      'up': -7,
      'down': 7,
      'right': 1,
      'left': -1
    };
  };

  DayPicker.prototype.setRange = function(rangeStart, rangeEnd, silent) {
    this.rangeStart = rangeStart === false ? null : rangeStart || this.rangeStart;
    this.rangeEnd = rangeEnd === false ? null : rangeEnd || this.rangeEnd;
    if (!silent) {
      this.emit('range', this, this.rangeStart, this.rangeEnd);
    }
    this.onRangeChanged(silent);
    if (this.rendered) {
      this.updateCalendar();
    }
  };

  DayPicker.prototype.setStartDate = function(startDate) {
    this.startDate = new Date(startDate.getTime());
  };

  DayPicker.prototype.setEndDate = function(endDate) {
    this.endDate = new Date(endDate.getTime());
  };

  DayPicker.prototype.onRangeChanged = function(silent) {};

  DayPicker.prototype.activateNext = function() {
    this.activate(null, this.activeDate.getMonth() + 1);
  };

  DayPicker.prototype.activatePrev = function() {
    this.activate(null, this.activeDate.getMonth() - 1);
  };

  DayPicker.prototype.onSelected = function(silent) {
    if (this.rangeSelector === 'end') {
      this.setRange(null, this.selectedDate, silent);
    } else if (this.rangeSelector === 'start') {
      this.setRange(this.selectedDate, null, silent);
    }
  };

  DayPicker.prototype.renderHeader = function() {
    var tr;
    tr = new Element('tr', {
      html: '<tr>' + '<th class="prev">«</th>' + '<th class="switch" colspan="5"></th>' + '<th class="next">»</th>' + '</tr>'
    });
    tr.inject(this.getElement('thead'));
    tr = new Element('tr', {
      html: '<tr>' + '<th class="dow">Su</th>' + '<th class="dow">Mo</th>' + '<th class="dow">Tu</th>' + '<th class="dow">We</th>' + '<th class="dow">Th</th>' + '<th class="dow">Fr</th>' + '<th class="dow">Sa</th>' + '</tr>'
    });
    tr.inject(this.getElement('thead'));
  };

  DayPicker.prototype.renderCalendar = function() {
    var body, date, enabledNextFirstDay, enabledPrevLastDay, first, firstDay, i, index, item, j, lastDay, length, nextFirstDay, prevLastDay, td, toDay, toDayDate, toDayIndex, tr, _i, _j, _k, _l, _m, _ref;
    date = this.activeDate;
    firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    prevLastDay = new Date(date.getFullYear(), date.getMonth(), 0);
    nextFirstDay = new Date(date.getFullYear(), date.getMonth() + 1, 1);
    toDay = new Date().toDateString();
    this.focusedIndex = null;
    this.items = [];
    first = firstDay.getDay() - 1;
    if (first <= 0) {
      first = 6;
    }
    for (i = _i = first; _i >= 0; i = _i += -1) {
      this.items.push({
        foreign: true,
        date: new Date(date.getFullYear(), date.getMonth(), -i)
      });
    }
    for (i = _j = 1, _ref = lastDay.getDate(); 1 <= _ref ? _j <= _ref : _j >= _ref; i = 1 <= _ref ? ++_j : --_j) {
      this.items.push({
        foreign: false,
        date: new Date(date.getFullYear(), date.getMonth(), i)
      });
    }
    length = this.items.length;
    for (i = _k = length; length <= 42 ? _k <= 42 : _k >= 42; i = length <= 42 ? ++_k : --_k) {
      this.items.push({
        foreign: true,
        date: new Date(date.getFullYear(), date.getMonth() + 1, i - length + 1)
      });
    }
    body = this.panel.getElement('tbody');
    body.empty();
    for (i = _l = 0; _l <= 5; i = ++_l) {
      tr = new Element('tr', {
        parent: body
      });
      for (j = _m = 0; _m <= 6; j = ++_m) {
        index = i * 7 + j;
        item = this.items[index];
        td = new Element('td', {
          parent: tr,
          html: item.date.getDate(),
          'data-index': index
        });
        if (this.isFocused(item.date)) {
          this.focusedIndex = index;
          this.focusedDate = item.date;
        }
        if (toDay === item.date.toDateString()) {
          td.addClass('today');
          toDayIndex = index;
          toDayDate = item.date;
        }
        item.index = index;
        item.cell = td;
      }
    }
    this.updateCalendar();
    if (!this.focusedDate && toDayDate) {
      this.focusedDate = toDayDate;
      this.focusedIndex = toDayIndex;
    }
    enabledPrevLastDay = this.isDayEnabled(prevLastDay);
    enabledNextFirstDay = this.isDayEnabled(nextFirstDay);
    this.panel.getElement('.prev').toggleClass('invisible', !enabledPrevLastDay);
    this.panel.getElement('.next').toggleClass('invisible', !enabledNextFirstDay);
    this.panel.getElement('.switch').toggleClass('disabled', !enabledNextFirstDay && !enabledPrevLastDay);
    this.panel.getElement('.switch').set('html', this.formatMonth(date) + ' ' + this.formatYear(date));
  };

  DayPicker.prototype.updateCalendar = function() {
    var i, item, _i;
    for (i = _i = 0; _i <= 41; i = ++_i) {
      item = this.items[i];
      item.cell.toggleClass('inactive', item.foreign).toggleClass('disabled', !this.isDayEnabled(item.date)).toggleClass('selected', this.isSelected(item.date)).toggleClass('focus', this.isFocused(item.date)).toggleClass('range-item', this.isDayInRange(item.date)).toggleClass('range-start', this.isSameDates(this.rangeStart, item.date)).toggleClass('range-end', this.isSameDates(this.rangeEnd, item.date));
    }
  };

  DayPicker.prototype.isSelected = function(date) {
    return this.selectedDate !== null && this.isSameDates(this.selectedDate, date);
  };

  DayPicker.prototype.isFocused = function(date) {
    return this.focusedDate !== null && this.isSameDates(this.focusedDate, date);
  };

  DayPicker.prototype.isDayInRange = function(date) {
    return this.rangeStart !== null && this.rangeEnd !== null && this.rangeStart <= date && this.rangeEnd >= date;
  };

  DayPicker.prototype.isSameDates = function(dateA, dateB) {
    return dateA !== null && dateB !== null && dateA.toDateString() === dateB.toDateString();
  };

  DayPicker.prototype.tryMoveFocus = function(index) {
    var date, focusedIndex;
    if (!this.focusedDate) {
      return;
    }
    date = this.focusedDate.getDate();
    focusedIndex = this.focusedIndex;
    this.focusedIndex += index;
    this.focusedDate.setDate(date + index);
    if (!this.items[this.focusedIndex]) {
      console.log("In component " + this.name + " was error");
      this.focusedDate.setDate(date);
      this.focusedIndex = focusedIndex;
      return;
    }
    if (this.isDayEnabled(this.focusedDate)) {
      if (this.focusedIndex < 0 || this.items[this.focusedIndex].foreign) {
        if (this.focusedIndex < 15) {
          this.activatePrev();
        } else {
          this.activateNext();
        }
      } else {
        this.updateCalendar();
      }
    } else {
      this.focusedDate.setDate(date);
      this.focusedIndex = focusedIndex;
    }
  };

  return DayPicker;

})(BaseDatePicker);

module.exports = DayPicker;


},{"./BaseDate":99}],103:[function(require,module,exports){
var BaseDatePicker, MonthPicker,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

BaseDatePicker = require('./BaseDate');

MonthPicker = (function(_super) {
  __extends(MonthPicker, _super);

  function MonthPicker() {
    return MonthPicker.__super__.constructor.apply(this, arguments);
  }

  MonthPicker.prototype.xtype = "monthpicker";

  MonthPicker.prototype.baseCls = 'monthpicker';

  MonthPicker.prototype.beforeInit = function() {
    MonthPicker.__super__.beforeInit.apply(this, arguments);
    this.moveIndex = {
      'up': -4,
      'down': 4,
      'right': 1,
      'left': -1
    };
  };

  MonthPicker.prototype.activatePrev = function() {
    this.activate(this.activeDate.getFullYear() - 1);
  };

  MonthPicker.prototype.activateNext = function() {
    this.activate(this.activeDate.getFullYear() + 1);
  };

  MonthPicker.prototype.renderCalendar = function() {
    var body, date, enabledNextYear, enabledPrevYear, i, index, item, j, nextYear, prevYear, tr, _i, _j, _k;
    date = this.activeDate;
    prevYear = new Date(date.getFullYear() - 1, 12, 0);
    nextYear = new Date(date.getFullYear() + 1, 1, 1);
    this.focusedIndex = null;
    this.items = [];
    for (i = _i = 0; _i <= 11; i = ++_i) {
      this.items.push({
        date: new Date(date.getFullYear(), i, 1),
        index: i
      });
    }
    body = this.panel.getElement('tbody');
    body.empty();
    for (i = _j = 0; _j <= 2; i = ++_j) {
      tr = new Element('tr', {
        parent: body
      });
      for (j = _k = 0; _k <= 3; j = ++_k) {
        index = i * 4 + j;
        item = this.items[index];
        item.cell = new Element('td', {
          parent: tr,
          html: this.formatMonth(item.date),
          'data-index': index
        });
        if (!this.isDayEnabled(item.date)) {
          item.cell.addClass('disabled');
        }
        if (this.isSelected(item.date)) {
          item.cell.addClass('selected');
        }
        if (this.isFocused(item.date)) {
          item.cell.addClass('focus');
          this.focusedIndex = index;
        }
      }
    }
    enabledPrevYear = this.isDayEnabled(prevYear);
    enabledNextYear = this.isDayEnabled(nextYear);
    this.panel.getElement('.prev').toggleClass('invisible', !enabledPrevYear);
    this.panel.getElement('.next').toggleClass('invisible', !enabledNextYear);
    this.panel.getElement('.switch').toggleClass('disabled', !enabledPrevYear && !enabledNextYear);
    this.panel.getElement('.switch').set('html', date.getFullYear());
  };

  MonthPicker.prototype.updateCalendar = function() {
    var i, item, _i;
    for (i = _i = 0; _i <= 11; i = ++_i) {
      item = this.items[i];
      item.cell.toggleClass('disabled', !this.isDayEnabled(item.date)).toggleClass('selected', this.isSelected(item.date)).toggleClass('focus', this.isFocused(item.date));
    }
  };

  MonthPicker.prototype.isSelected = function(date) {
    return this.selectedDate !== null && this.selectedDate.getYear() === date.getYear() && this.selectedDate.getMonth() === date.getMonth();
  };

  MonthPicker.prototype.isFocused = function(date) {
    return this.focusedDate !== null && this.focusedDate.getYear() === date.getYear() && this.focusedDate.getMonth() === date.getMonth();
  };

  MonthPicker.prototype.tryMoveFocus = function(index) {
    var focusedIndex, month;
    month = this.focusedDate.getMonth();
    focusedIndex = this.focusedIndex;
    this.focusedIndex += index;
    this.focusedDate.setMonth(month + index);
    if (this.isDayEnabled(this.focusedDate)) {
      this.updateCalendar();
    } else {
      this.focusedDate.setMonth(month);
      this.focusedDateIndex = focusedIndex;
    }
  };

  return MonthPicker;

})(BaseDatePicker);

module.exports = MonthPicker;


},{"./BaseDate":99}],104:[function(require,module,exports){
var ColorPicker, DatePicker, PickerManager, Popover;

Popover = require('../tip/Popover');

ColorPicker = require('./Color');

DatePicker = require('./Date');

PickerManager = (function() {
  function PickerManager() {}

  PickerManager.prototype.createPopoverPicker = function(type, config) {
    var factory;
    factory = 'create' + type.capitalize() + 'Picker';
    if (!this[factory]) {
      throw new Error("Undefined factory function for '" + type + "' picker");
    }
    return this[factory](config);
  };

  PickerManager.prototype.createColorPicker = function(config) {
    var popover;
    popover = new Popover({
      target: config.target,
      placement: config.placement,
      closeMode: config.closeMode || 'close',
      title: miwo.tr('miwo.pickers.selectColor'),
      styles: {
        maxWidth: 500
      }
    });
    popover.add('picker', new ColorPicker(config));
    return popover;
  };

  PickerManager.prototype.createDatePicker = function(config) {
    var picker, popover;
    popover = new Popover({
      target: config.target,
      placement: config.placement,
      closeMode: config.closeMode || 'close',
      title: '',
      styles: {
        width: 260
      }
    });
    picker = new DatePicker(config);
    picker.on('switch', (function(_this) {
      return function() {
        popover.updatePosition();
      };
    })(this));
    popover.add('picker', picker);
    return popover;
  };

  return PickerManager;

})();

module.exports = PickerManager;


},{"../tip/Popover":123,"./Color":100,"./Date":101}],105:[function(require,module,exports){



},{}],106:[function(require,module,exports){
var BaseDatePicker, YearPicker,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

BaseDatePicker = require('./BaseDate');

YearPicker = (function(_super) {
  __extends(YearPicker, _super);

  function YearPicker() {
    return YearPicker.__super__.constructor.apply(this, arguments);
  }

  YearPicker.prototype.xtype = "yearpicker";

  YearPicker.prototype.baseCls = 'yearpicker';

  YearPicker.prototype.beforeInit = function() {
    YearPicker.__super__.beforeInit.apply(this, arguments);
    this.moveIndex = {
      'up': -4,
      'down': 4,
      'right': 1,
      'left': -1
    };
  };

  YearPicker.prototype.activatePrev = function() {
    this.activate(this.activeDate.getFullYear() - 10);
  };

  YearPicker.prototype.activateNext = function() {
    this.activate(this.activeDate.getFullYear() + 10);
  };

  YearPicker.prototype.renderCalendar = function() {
    var body, date, enabledNextYear, enabledPrevYear, firstYear, i, index, item, j, lastYear, nextYear, prevYear, tr, _i, _j, _k;
    date = this.activeDate;
    prevYear = new Date(date.getFullYear() - 1, 0, 1);
    nextYear = new Date(date.getFullYear() + 10, 0, 1);
    this.focusedIndex = null;
    this.items = [];
    for (i = _i = 0; _i <= 11; i = ++_i) {
      this.items.push({
        date: new Date(date.getFullYear() + i - 1, 0, 1),
        index: i,
        foreign: i === 0 && i === 11
      });
    }
    body = this.panel.getElement('tbody');
    body.empty();
    for (i = _j = 0; _j <= 2; i = ++_j) {
      tr = new Element('tr', {
        parent: body
      });
      for (j = _k = 0; _k <= 3; j = ++_k) {
        index = i * 4 + j;
        item = this.items[index];
        item.cell = new Element('td', {
          parent: tr,
          html: this.formatYear(item.date),
          'data-index': index
        });
        if (!this.isDayEnabled(item.date)) {
          item.cell.addClass('disabled');
        }
        if (this.isSelected(item.date)) {
          item.cell.addClass('selected');
        }
        if (this.isFocused(item.date)) {
          item.cell.addClass('focus');
          this.focusedIndex = index;
        }
      }
    }
    firstYear = new Date(date.getFullYear(), 0, 1);
    lastYear = new Date(date.getFullYear() + 9, 0, 1);
    enabledPrevYear = this.isDayEnabled(prevYear);
    enabledNextYear = this.isDayEnabled(nextYear);
    this.panel.getElement('.prev').toggleClass('invisible', !enabledPrevYear);
    this.panel.getElement('.next').toggleClass('invisible', !enabledNextYear);
    this.panel.getElement('.switch').toggleClass('disabled', !enabledPrevYear && !enabledNextYear);
    this.panel.getElement('.switch').set('html', this.formatYear(firstYear) + ' - ' + this.formatYear(lastYear));
  };

  YearPicker.prototype.updateCalendar = function() {
    var i, item, _i;
    for (i = _i = 0; _i <= 11; i = ++_i) {
      item = this.items[i];
      item.cell.toggleClass('disabled', !this.isDayEnabled(item.date)).toggleClass('selected', this.isSelected(item.date)).toggleClass('focus', this.isFocused(item.date));
    }
  };

  YearPicker.prototype.isSelected = function(date) {
    return this.selectedDate !== null && this.selectedDate.getYear() === date.getYear();
  };

  YearPicker.prototype.isFocused = function(date) {
    return this.focusedDate !== null && this.focusedDate.getYear() === date.getYear();
  };

  YearPicker.prototype.tryMoveFocus = function(index) {
    var focusedIndex, year;
    year = this.focusedDate.getFullYear();
    focusedIndex = this.focusedIndex;
    this.focusedIndex += index;
    this.focusedDate.setFullYear(year + index);
    if (this.isDayEnabled(this.focusedDate)) {
      if (this.focusedIndex < 0 || this.items[this.focusedIndex].foreign) {
        if (this.focusedIndex < 6) {
          this.activatePrev();
        } else {
          this.activateNext();
        }
      } else {
        this.updateCalendar();
      }
    } else {
      this.focusedDate.setFullYear(year);
      this.focusedDateIndex = focusedIndex;
    }
  };

  return YearPicker;

})(BaseDatePicker);

module.exports = YearPicker;


},{"./BaseDate":99}],107:[function(require,module,exports){
module.exports = {
  PickerManager: require('./PickerManager'),
  Color: require('./Color'),
  Day: require('./Day'),
  Month: require('./Month'),
  Year: require('./Year'),
  Date: require('./Date'),
  Time: require('./Time')
};


},{"./Color":100,"./Date":101,"./Day":102,"./Month":103,"./PickerManager":104,"./Time":105,"./Year":106}],108:[function(require,module,exports){
var Bar,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Bar = (function(_super) {
  __extends(Bar, _super);

  function Bar() {
    return Bar.__super__.constructor.apply(this, arguments);
  }

  Bar.prototype.value = 50;

  Bar.prototype.minWidth = null;

  Bar.prototype.desc = '';

  Bar.prototype.type = null;

  Bar.prototype.hideValue = false;

  Bar.prototype.striped = false;

  Bar.prototype.active = false;

  Bar.prototype.baseCls = 'progress-bar';

  Bar.prototype.role = 'progressbar';

  Bar.prototype.progressEl = null;

  Bar.prototype.statusEl = null;

  Bar.prototype.valueEl = null;

  Bar.prototype.descEl = null;

  Bar.prototype.setValue = function(value) {
    this.value = value;
    this.emit('change', this, value);
    if (!this.rendered) {
      return;
    }
    this.el.setStyle('width', value + '%');
    this.el.set('aria-valuenow', value);
    this.valueEl.set('text', value + '%');
  };

  Bar.prototype.setDescription = function(desc) {
    this.desc = desc;
    if (!this.rendered) {
      return;
    }
    this.descEl.set('html', desc);
  };

  Bar.prototype.setType = function(type) {
    if (this.type) {
      this.el.removeClass('progress-bar-' + this.type);
    }
    if (type) {
      this.el.addClass('progress-bar-' + type);
    }
    this.type = type;
    this.emit('type', this, type);
  };

  Bar.prototype.setActive = function(active) {
    if (active == null) {
      active = true;
    }
    this.active = active;
    this.emit('active', this, active);
    if (!this.rendered) {
      return;
    }
    this.progressEl.toggleClass('progress-bar-active', active);
  };

  Bar.prototype.setHideValue = function(hideValue) {
    this.hideValue = hideValue;
    if (!this.rendered) {
      return;
    }
    this.valueEl.setVisible(!this.hideValue);
  };

  Bar.prototype.getValue = function() {
    return this.value;
  };

  Bar.prototype.doRender = function() {
    this.el.set('html', '<span miwo-reference="labelEl" class="progress-bar-label">' + '<span miwo-reference="valueEl" class="progress-bar-value">' + this.value + '%</span> ' + '<span miwo-reference="descEl" class="progress-bar-desc">' + this.desc + '</span>' + '</span>');
  };

  Bar.prototype.afterRender = function() {
    Bar.__super__.afterRender.apply(this, arguments);
    this.valueEl.setVisible(!this.hideValue);
    if (this.type) {
      this.el.addClass('progress-bar-' + this.type);
    }
    if (this.striped) {
      this.el.addClass('progress-bar-striped');
    }
    if (this.active) {
      this.el.addClass('active');
    }
    if (this.minWidth) {
      this.el.setStyle('min-width', this.minWidth + 'em');
    }
    this.el.setStyle('width', this.value + '%');
    this.el.set('aria-valuenow', this.value);
    this.el.set('aria-valuemin', 0);
    this.el.set('aria-valuemax', 100);
  };

  return Bar;

})(Miwo.Component);

module.exports = Bar;


},{}],109:[function(require,module,exports){
var Bar, ProgressBar,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Bar = require('./Bar');

ProgressBar = (function(_super) {
  __extends(ProgressBar, _super);

  ProgressBar.prototype.bar = null;

  ProgressBar.prototype.baseCls = 'progress';

  function ProgressBar(config) {
    this.bar = new Bar(config);
    ProgressBar.__super__.constructor.call(this, config);
    return;
  }

  ProgressBar.prototype.doInit = function() {
    ProgressBar.__super__.doInit.apply(this, arguments);
    this.add('bar', this.bar);
  };

  ProgressBar.prototype.setValue = function(value) {
    return this.bar.setValue(value);
  };

  ProgressBar.prototype.setDescription = function(desc) {
    return this.bar.setDescription(desc);
  };

  ProgressBar.prototype.setType = function(type) {
    return this.bar.setType(type);
  };

  ProgressBar.prototype.setActive = function(active) {
    return this.bar.setActive(active);
  };

  ProgressBar.prototype.setHideValue = function(hideValue) {
    return this.bar.setHideValue(hideValue);
  };

  ProgressBar.prototype.getValue = function() {
    return this.bar.getValue();
  };

  return ProgressBar;

})(Miwo.Container);

module.exports = ProgressBar;


},{"./Bar":108}],110:[function(require,module,exports){
var Bar, StackedBar,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Bar = require('./Bar');

StackedBar = (function(_super) {
  __extends(StackedBar, _super);

  function StackedBar() {
    return StackedBar.__super__.constructor.apply(this, arguments);
  }

  StackedBar.prototype.baseCls = 'progress';

  StackedBar.prototype.addBar = function(name, config) {
    return this.add(name, new Bar(config));
  };

  return StackedBar;

})(Miwo.Container);

module.exports = StackedBar;


},{"./Bar":108}],111:[function(require,module,exports){
module.exports = {
  Bar: require('./Bar'),
  ProgressBar: require('./ProgressBar'),
  StackedBar: require('./StackedBar')
};


},{"./Bar":108,"./ProgressBar":109,"./StackedBar":110}],112:[function(require,module,exports){
var BaseSelector,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

BaseSelector = (function(_super) {
  __extends(BaseSelector, _super);

  function BaseSelector() {
    return BaseSelector.__super__.constructor.apply(this, arguments);
  }

  BaseSelector.prototype.isSelector = true;

  BaseSelector.prototype.checkerRequired = false;

  BaseSelector.prototype.grid = null;

  BaseSelector.prototype.selection = null;

  BaseSelector.prototype.setGrid = function(grid) {
    this.grid = grid;
    this.mon(grid, 'render', 'gridRender');
    this.mon(grid, 'refresh', 'gridRefresh');
  };

  BaseSelector.prototype.setSelectionModel = function(selection) {
    this.selection = selection;
    this.mon(selection, 'select', 'modelSelect');
    this.mon(selection, 'deselect', 'modelDeselect');
    this.mon(selection, 'change', 'modelChange');
  };

  BaseSelector.prototype.gridRefresh = function(grid) {};

  BaseSelector.prototype.gridRender = function(grid) {
    grid.el.addClass('grid-select-' + this.type);
  };

  BaseSelector.prototype.modelSelect = function(selection, record, rowIndex) {};

  BaseSelector.prototype.modelDeselect = function(selection, record, rowIndex) {};

  BaseSelector.prototype.modelChange = function(selection, rs) {};

  BaseSelector.prototype.doDestroy = function() {
    this.grid = null;
    this.selection = null;
    return BaseSelector.__super__.doDestroy.apply(this, arguments);
  };

  return BaseSelector;

})(Miwo.Object);

module.exports = BaseSelector;


},{}],113:[function(require,module,exports){
var CheckSelector, RowSelector,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

RowSelector = require('./RowSelector');

CheckSelector = (function(_super) {
  __extends(CheckSelector, _super);

  function CheckSelector() {
    return CheckSelector.__super__.constructor.apply(this, arguments);
  }

  CheckSelector.prototype.type = 'check';

  CheckSelector.prototype.selectOnRowClick = false;

  CheckSelector.prototype.checkerRequired = true;

  CheckSelector.prototype.setCheckColumn = function(column) {
    this.column = column;
    this.mon(column, 'rowcheck', 'onRowCheck');
    this.mon(column, 'headercheck', 'onHeaderCheck');
  };

  CheckSelector.prototype.onRowCheck = function(column, row, checked) {
    var rec;
    rec = row.retrieve('record');
    this.selection.setSelected(rec, checked);
  };

  CheckSelector.prototype.onHeaderCheck = function(column, checked) {
    this.selection.setSelectedAll(checked);
  };

  CheckSelector.prototype.modelSelect = function(selection, record) {
    this.column.setCheckedRow(record, true);
  };

  CheckSelector.prototype.modelDeselect = function(selection, record) {
    this.column.setCheckedRow(record, false);
  };

  CheckSelector.prototype.modelChange = function(selection, rs) {
    var selectedAll;
    CheckSelector.__super__.modelChange.call(this, selection, rs);
    selectedAll = selection.getTotalSelectableCount() === selection.getCount();
    this.column.setCheckedHeader(selectedAll && selection.hasSelection());
  };

  CheckSelector.prototype.gridRender = function(grid) {
    CheckSelector.__super__.gridRender.call(this, grid);
    this.setCheckColumn(grid.checker);
  };

  CheckSelector.prototype.gridRefresh = function(grid) {
    var sm;
    if (!this.column) {
      throw new Error("Check selector is not binded with column. You should call setCheckColumn(). Maybe grid is not rendered");
    }
    sm = grid.getSelectionModel();
    grid.getRecords().each((function(_this) {
      return function(rec) {
        if (!sm.isSelectable(rec)) {
          _this.column.setDisabledRow(rec, true);
        }
      };
    })(this));
    sm.getSelection().each((function(_this) {
      return function(rec) {
        _this.modelSelect(sm, rec);
      };
    })(this));
  };

  CheckSelector.prototype.doDestroy = function() {
    this.column = null;
    return CheckSelector.__super__.doDestroy.apply(this, arguments);
  };

  return CheckSelector;

})(RowSelector);

module.exports = CheckSelector;


},{"./RowSelector":114}],114:[function(require,module,exports){
var BaseSelector, RowSelector,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

BaseSelector = require('./BaseSelector');

RowSelector = (function(_super) {
  __extends(RowSelector, _super);

  function RowSelector() {
    return RowSelector.__super__.constructor.apply(this, arguments);
  }

  RowSelector.prototype.type = 'row';

  RowSelector.prototype.selectOnRowClick = true;

  RowSelector.prototype.gridRender = function(grid) {
    RowSelector.__super__.gridRender.call(this, grid);
    if (this.selectOnRowClick) {
      this.mon(grid.bodyEl, "click:relay(tr)", (function(_this) {
        return function(event, target) {
          _this.onRowClick(target, event);
        };
      })(this));
    }
  };

  RowSelector.prototype.onRowClick = function(tr, event) {
    var record;
    if (!event.control && !event.meta) {
      this.selection.deselectAll();
    }
    if ((record = tr.retrieve("record"))) {
      this.selection.toggle(record);
    }
  };

  RowSelector.prototype.getRowByRecord = function(record) {
    var tr, _i, _len, _ref;
    _ref = this.grid.bodyEl.getElements('tr');
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      tr = _ref[_i];
      if (tr.retrieve('record') && tr.retrieve('record').id === record.id) {
        return tr;
      }
    }
    return null;
  };

  RowSelector.prototype.modelSelect = function(selection, record) {
    var row;
    row = this.getRowByRecord(record);
    if (row) {
      row.addClass("grid-selected");
    }
  };

  RowSelector.prototype.modelDeselect = function(selection, record) {
    var row;
    row = this.getRowByRecord(record);
    if (row) {
      row.removeClass("grid-selected");
    }
  };

  return RowSelector;

})(BaseSelector);

module.exports = RowSelector;


},{"./BaseSelector":112}],115:[function(require,module,exports){
var SelectionModel,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

SelectionModel = (function(_super) {
  __extends(SelectionModel, _super);

  SelectionModel.prototype.type = "single";

  SelectionModel.prototype.pruneRemoved = true;

  SelectionModel.prototype.locked = false;

  SelectionModel.prototype.selected = [];

  SelectionModel.prototype.lastSelected = null;

  SelectionModel.prototype.store = null;

  SelectionModel.prototype.selectionChanged = false;

  SelectionModel.prototype.emitEvents = true;

  SelectionModel.prototype.selectableIndex = null;

  SelectionModel.prototype.selectableHandler = null;

  function SelectionModel(config) {
    SelectionModel.__super__.constructor.call(this, config);
    this.selected = [];
  }

  SelectionModel.prototype.setStore = function(store) {
    this.store = store;
    this.mon(store, 'datachanged', 'onStoreDataChanged');
    this.mon(store, 'clear', 'onStoreClear');
    this.mon(store, 'remove', 'onStoreRemove');
  };

  SelectionModel.prototype.getStore = function() {
    return this.store;
  };

  SelectionModel.prototype.onStoreDataChanged = function() {
    this.refresh();
  };

  SelectionModel.prototype.onStoreClear = function() {
    if (this.getCount() > 0) {
      this.clearSelections();
      this.selectionChanged = true;
      this.checkSelectionChanged();
    }
  };

  SelectionModel.prototype.onStoreRemove = function(store, rec, index) {
    if (this.lastSelected === rec) {
      this.lastSelected = null;
    }
    if (this.isSelected(rec)) {
      this.selected.erase(rec);
      this.selectionChanged = true;
      this.checkSelectionChanged();
    }
  };

  SelectionModel.prototype.clearSelections = function() {
    this.selected.empty();
    this.lastSelected = null;
  };

  SelectionModel.prototype.isLocked = function() {
    return this.locked;
  };

  SelectionModel.prototype.setLocked = function(locked) {
    this.locked = !!locked;
  };

  SelectionModel.prototype.isSelected = function(record) {
    record = (Type.isNumber(record) ? this.store.getAt(record) : record);
    return this.selected.indexOf(record) !== -1;
  };

  SelectionModel.prototype.isSelectable = function(record) {
    if (!this.selectableIndex && !this.selectableHandler) {
      return true;
    } else {
      record = (Type.isNumber(record) ? this.store.getAt(record) : record);
      if (this.selectableHandler) {
        return this.selectableHandler(record);
      } else {
        return !!record.get(this.selectableIndex);
      }
    }
  };

  SelectionModel.prototype.getSelection = function() {
    return this.selected;
  };

  SelectionModel.prototype.getRecords = function() {
    var rec, rs, _i, _len, _ref;
    rs = [];
    _ref = this.selected;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      rec = _ref[_i];
      rs.push(rec);
    }
    return rs;
  };

  SelectionModel.prototype.hasSelection = function() {
    return this.getCount() > 0;
  };

  SelectionModel.prototype.getFirstSelected = function() {
    return (this.hasSelection() ? this.records[0] : null);
  };

  SelectionModel.prototype.getLastSelected = function() {
    return (this.hasSelection() ? this.records.getLast() : null);
  };

  SelectionModel.prototype.getCount = function() {
    return this.selected.length;
  };

  SelectionModel.prototype.getTotalCount = function() {
    return this.getStore().getCount();
  };

  SelectionModel.prototype.getTotalSelectableCount = function() {
    var count;
    count = 0;
    this.getStore().each((function(_this) {
      return function(r) {
        if (_this.isSelectable(r)) {
          count++;
        }
      };
    })(this));
    return count;
  };

  SelectionModel.prototype.selectAll = function(silent) {
    var records;
    records = this.store.getRecords();
    this.doSelect(records, silent);
  };

  SelectionModel.prototype.deselectAll = function(silent) {
    var records;
    records = [];
    this.getSelection().each(function(record) {
      records.push(record);
    });
    this.doDeselect(records, silent);
  };

  SelectionModel.prototype.select = function(records, silent) {
    if (this.type === "single" && this.hasSelection()) {
      this.deselectAll();
    }
    this.doSelect(records, silent);
  };

  SelectionModel.prototype.deselect = function(records, silent) {
    this.doDeselect(records, silent);
  };

  SelectionModel.prototype.toggle = function(records, silent) {
    var record, toDeselect, toSelect, _i, _len, _ref;
    toSelect = [];
    toDeselect = [];
    _ref = Array.from(records);
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      record = _ref[_i];
      if (this.isSelected(record)) {
        toDeselect.push(record);
      } else {
        toSelect.push(record);
      }
    }
    if (toSelect.length > 0) {
      this.select(toSelect, silent);
    }
    if (toDeselect.length > 0) {
      this.deselect(toDeselect, silent);
    }
  };

  SelectionModel.prototype.setSelected = function(records, select, silent) {
    this[(select ? "select" : "deselect")](records, silent);
  };

  SelectionModel.prototype.setSelectedAll = function(select, silent) {
    this[(select ? "selectAll" : "deselectAll")](silent);
  };

  SelectionModel.prototype.doSelect = function(records, silent) {
    if (this.locked || !this.store) {
      return;
    }
    if (typeof records === "number") {
      records = [this.store.getAt(records)];
    }
    this.selectionChanged = false;
    Array.from(records).each((function(_this) {
      return function(record) {
        if (_this.isSelectable(record)) {
          if (!_this.isSelected(record)) {
            _this.selectionChanged = true;
            _this.selected.include(record);
            if (_this.emitEvents) {
              _this.emit('select', _this, record, _this.store.indexOf(record));
            }
          }
          _this.lastSelected = record;
        }
      };
    })(this));
    if (!silent) {
      this.checkSelectionChanged();
    }
  };

  SelectionModel.prototype.doDeselect = function(records, silent) {
    if (this.locked || !this.store) {
      return;
    }
    if (typeof records === "number") {
      records = [this.store.getAt(records)];
    }
    this.selectionChanged = false;
    Array.from(records).each((function(_this) {
      return function(record) {
        if (_this.isSelectable(record)) {
          if (_this.isSelected(record)) {
            _this.selectionChanged = true;
            _this.selected.erase(record);
            if (_this.emitEvents) {
              _this.emit('deselect', _this, record, _this.store.indexOf(record));
            }
          }
        }
      };
    })(this));
    if (!silent) {
      this.checkSelectionChanged();
    }
  };

  SelectionModel.prototype.checkSelectionChanged = function() {
    if (this.emitEvents && this.selectionChanged) {
      this.emit('change', this, this.getSelection());
    }
  };

  SelectionModel.prototype.refresh = function() {
    var rec, selection, toBeReAdded, toBeSelected, _i, _len, _ref;
    rec = void 0;
    toBeSelected = [];
    toBeReAdded = [];
    if (!this.store) {
      return;
    }
    _ref = this.selected;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      selection = _ref[_i];
      if (this.store.indexOf(selection) !== -1) {
        rec = this.store.getById(selection.getId());
        if (rec) {
          toBeSelected.push(rec);
        }
      } else if (!this.pruneRemoved) {
        rec = this.store.getById(selection.getId());
        if (rec) {
          toBeSelected.push(rec);
        } else {
          toBeReAdded.push(selection);
        }
      }
    }
    this.emitEvents = false;
    this.clearSelections();
    if (toBeSelected.length) {
      this.doSelect(toBeSelected, true);
    }
    if (toBeReAdded.length) {
      this.selection.append(toBeReAdded);
      if (!this.lastSelected) {
        this.lastSelected = toBeReAdded[toBeReAdded.length - 1];
      }
    }
    this.emitEvents = true;
    this.checkSelectionChanged();
  };

  SelectionModel.prototype.doDestroy = function() {
    this.store = null;
    SelectionModel.__super__.doDestroy.call(this);
  };

  return SelectionModel;

})(Miwo.Object);

module.exports = SelectionModel;


},{}],116:[function(require,module,exports){
var SelectorFactory;

SelectorFactory = (function() {
  SelectorFactory.prototype.defines = null;

  function SelectorFactory() {
    this.defines = {};
  }

  SelectorFactory.prototype.register = function(name, klass) {
    this.defines[name] = klass;
  };

  SelectorFactory.prototype.create = function(name, config) {
    if (!this.defines[name]) {
      throw new Error("Selector with name " + name + " is not defined");
    }
    return new this.defines[name](config);
  };

  return SelectorFactory;

})();

module.exports = SelectorFactory;


},{}],117:[function(require,module,exports){
module.exports = {
  SelectorFactory: require('./SelectorFactory'),
  BaseSelector: require('./BaseSelector'),
  RowSelector: require('./RowSelector'),
  CheckSelector: require('./CheckSelector'),
  SelectionModel: require('./SelectionModel')
};


},{"./BaseSelector":112,"./CheckSelector":113,"./RowSelector":114,"./SelectionModel":115,"./SelectorFactory":116}],118:[function(require,module,exports){
var Pane, TabPanel,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Pane = require('../panel/Pane');

TabPanel = (function(_super) {
  __extends(TabPanel, _super);

  function TabPanel() {
    return TabPanel.__super__.constructor.apply(this, arguments);
  }

  TabPanel.prototype.tab = null;

  TabPanel.prototype.baseCls = 'tab-pane';

  TabPanel.prototype.visible = false;

  TabPanel.prototype.role = 'tabpanel';

  TabPanel.prototype.doInit = function() {
    TabPanel.__super__.doInit.call(this);
    this.tab = new Element('li', {
      role: 'presentation'
    });
  };

  TabPanel.prototype.doRender = function() {
    var link;
    TabPanel.__super__.doRender.call(this);
    link = new Element('a', {
      'aria-controls': this.id,
      href: '#' + this.name,
      role: 'tab',
      html: this.title
    });
    link.inject(this.tab);
  };

  TabPanel.prototype.setTitle = function(title) {
    this.title = title;
    this.tab.set('html', title);
  };

  TabPanel.prototype.markActive = function(active) {
    this.setVisible(active);
    this.el.toggleClass('active', active);
    this.tab.toggleClass('active', active);
    this.emit('active', this, active);
  };

  TabPanel.prototype.setActive = function() {
    this.getParent().setActive(this.name);
  };

  TabPanel.prototype.doDestroy = function() {
    this.tab.destroy();
    return TabPanel.__super__.doDestroy.call(this);
  };

  return TabPanel;

})(Pane);

module.exports = TabPanel;


},{"../panel/Pane":96}],119:[function(require,module,exports){
var TabPanel, Tabs,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

TabPanel = require('./TabPanel');

Tabs = (function(_super) {
  __extends(Tabs, _super);

  function Tabs() {
    return Tabs.__super__.constructor.apply(this, arguments);
  }

  Tabs.prototype.xtype = 'tabs';

  Tabs.prototype.align = 'vertical';

  Tabs.prototype.active = null;

  Tabs.prototype.tabsEl = null;

  Tabs.prototype.scrollable = false;

  Tabs.prototype.doInit = function() {
    Tabs.__super__.doInit.call(this);
    if (this.align === 'vertical') {
      this.html = '<ul miwo-reference="tabsEl" class="nav nav-tabs" role="tablist"></ul>' + '<div miwo-reference="contentEl" class="tab-content"></div>';
    } else if (this.align === 'horizontal') {
      this.html = '<div class="row">' + '<div class="col-sm-3">' + '<ul miwo-reference="tabsEl" class="nav nav-tabs" role="tablist"></ul>' + '</div>' + '<div class="col-sm-9">' + '<div miwo-reference="contentEl" class="tab-content"></div>' + '</div>' + '</div>';
    }
  };

  Tabs.prototype.setActive = function(name) {
    var next, previous;
    if (!name && this.firstChild()) {
      name = this.firstChild().name;
    }
    previous = Type.isString(this.active) ? null : this.active;
    next = name ? this.get(name) : null;
    if (previous !== next) {
      if (previous) {
        previous.markActive(false);
      }
      if (next) {
        next.markActive(true);
      }
      this.emit('active', this, next, previous);
      this.active = next;
    }
  };

  Tabs.prototype.getActive = function() {
    return this.active;
  };

  Tabs.prototype.addPanel = function(name, config) {
    return this.add(name, new TabPanel(config));
  };

  Tabs.prototype.addedComponent = function(component) {
    if (!component.scrollable && this.scrollable) {
      component.setScrollable(true);
    }
  };

  Tabs.prototype.doRender = function() {
    Tabs.__super__.doRender.apply(this, arguments);
    this.el.addClass('tabs-' + this.align);
  };

  Tabs.prototype.afterRender = function() {
    Tabs.__super__.afterRender.apply(this, arguments);
    this.setActive(this.active);
    this.mon(this.el, 'click:relay(.nav a)', 'onTabClick');
    this.tabsEl.set('role', 'tablist');
  };

  Tabs.prototype.renderComponent = function(component) {
    Tabs.__super__.renderComponent.call(this, component);
    component.tab.inject(this.tabsEl);
  };

  Tabs.prototype.removedComponent = function(component) {
    if (this.active === component.name) {
      this.setActive();
    }
  };

  Tabs.prototype.onTabClick = function(event, target) {
    event.stop();
    this.setActive(target.get('href').replace('#', ''));
  };

  return Tabs;

})(Miwo.Container);

module.exports = Tabs;


},{"./TabPanel":118}],120:[function(require,module,exports){
module.exports = {
  Tabs: require('./Tabs'),
  Panel: require('./TabPanel'),
  TabPanel: require('./TabPanel')
};


},{"./TabPanel":118,"./Tabs":119}],121:[function(require,module,exports){
var BaseTip,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

BaseTip = (function(_super) {
  __extends(BaseTip, _super);

  function BaseTip() {
    return BaseTip.__super__.constructor.apply(this, arguments);
  }

  BaseTip.prototype.xtype = 'tip';

  BaseTip.prototype.placement = "top";

  BaseTip.prototype.distance = 0;

  BaseTip.prototype.target = null;

  BaseTip.prototype.type = 'default';

  BaseTip.prototype.container = null;

  BaseTip.prototype.delay = null;

  BaseTip.prototype.visible = false;

  BaseTip.prototype.afterInit = function() {
    BaseTip.__super__.afterInit.call(this);
    this.renderTo = this.renderTo ? $(this.renderTo) : miwo.body;
  };

  BaseTip.prototype.afterRender = function() {
    BaseTip.__super__.afterRender.call(this);
    this.el.on("mouseenter", (function(_this) {
      return function() {
        _this.el.addClass("hover");
        _this.emit('mouseenter', _this);
      };
    })(this));
    this.el.on("mouseleave", (function(_this) {
      return function() {
        _this.el.removeClass("hover");
        _this.emit('mouseleave', _this);
      };
    })(this));
  };

  BaseTip.prototype.show = function() {
    if (this.visible) {
      return;
    }
    this.visible = true;
    if (!this.rendered) {
      this.render();
    }
    if (this.delay) {
      this.el.show.delay(this.delay, this.el);
    } else {
      this.el.show();
    }
    this.updatePosition();
    this.emit('show', this);
    return this;
  };

  BaseTip.prototype.hide = function() {
    if (!this.visible) {
      return;
    }
    this.visible = false;
    this.emit('hide', this);
    this.el.hide();
    return this;
  };

  BaseTip.prototype.close = function() {
    if (!this.visible) {
      return;
    }
    this.hide();
    this.emit('close', this);
    this.destroy();
    return this;
  };

  BaseTip.prototype.isHover = function() {
    return this.el.hasClass("hover");
  };

  BaseTip.prototype.isVisible = function() {
    return this.el.isVisible();
  };

  BaseTip.prototype.updatePosition = function() {
    var distance, pos, size, sizeTarget;
    pos = this.target.getPosition();
    sizeTarget = this.target.getSize();
    size = this.el.getSize();
    distance = this.distance;
    switch (this.placement) {
      case "top":
        this.el.setPosition({
          x: pos.x - size.x / 2 + sizeTarget.x / 2,
          y: pos.y - size.y - distance
        });
        break;
      case "bottom":
        this.el.setPosition({
          x: pos.x - size.x / 2 + sizeTarget.x / 2,
          y: pos.y + sizeTarget.y + distance
        });
        break;
      case "left":
        this.el.setPosition({
          x: pos.x - size.x - distance,
          y: pos.y + sizeTarget.y / 2 - size.y / 2
        });
        break;
      case "right":
        this.el.setPosition({
          x: pos.x + sizeTarget.x + distance,
          y: pos.y + sizeTarget.y / 2 - size.y / 2
        });
    }
  };

  return BaseTip;

})(Miwo.Container);

module.exports = BaseTip;


},{}],122:[function(require,module,exports){
var BaseTipManager,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

BaseTipManager = (function(_super) {
  __extends(BaseTipManager, _super);

  function BaseTipManager() {
    return BaseTipManager.__super__.constructor.apply(this, arguments);
  }

  BaseTipManager.prototype.placement = 'top';

  BaseTipManager.prototype.distance = 3;

  BaseTipManager.prototype.delay = 500;

  BaseTipManager.prototype.tip = null;

  BaseTipManager.prototype.target = null;

  BaseTipManager.prototype.show = function(target, config) {
    var tip;
    if (this.target === target) {
      return;
    }
    if (this.tip === this.tipToHide) {
      this.tipToHide = null;
    }
    if (this.tip) {
      this.hide();
    }
    tip = this.create(target, config);
    if (!tip) {
      return;
    }
    this.target = target;
    this.tip = tip;
    this.tip.show();
    this.tip.on('mouseleave', (function(_this) {
      return function() {
        return _this.hide();
      };
    })(this));
    if (target.get("title")) {
      target.set("data-title", target.get("title"));
      target.set("title", null);
    }
    target.on("mouseleave", this.bound('onTargetLeave'));
    target.on("mousedown", this.bound('onTargetClick'));
  };

  BaseTipManager.prototype.toggle = function(target) {
    if (this.tip) {
      this.hide();
    } else {
      this.show(target);
    }
  };

  BaseTipManager.prototype.hide = function() {
    if (!this.tip) {
      return;
    }
    this.tip.destroy();
    this.tip = null;
    this.target.un("mouseleave", this.bound('onTargetLeave'));
    this.target.un("click", this.bound('onTargetClick'));
    this.target = null;
  };

  BaseTipManager.prototype.onTargetLeave = function() {
    this.tipToHide = this.tip;
    this.target.un("mouseleave", this.bound('onTargetLeave'));
    setTimeout(((function(_this) {
      return function() {
        if (_this.tipToHide && !_this.tipToHide.isHover()) {
          _this.hide();
        }
      };
    })(this)), 200);
  };

  BaseTipManager.prototype.onTargetClick = function() {
    this.toggle(this.target);
  };

  return BaseTipManager;

})(Miwo.Object);

module.exports = BaseTipManager;


},{}],123:[function(require,module,exports){
var BaseTip, Popover, ScreenMask,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

BaseTip = require('./BaseTip');

ScreenMask = require('../utils/ScreenMask');

Popover = (function(_super) {
  __extends(Popover, _super);

  function Popover() {
    return Popover.__super__.constructor.apply(this, arguments);
  }

  Popover.prototype.xtype = 'popover';

  Popover.prototype.title = '';

  Popover.prototype.content = '';

  Popover.prototype.baseCls = 'popover';

  Popover.prototype.screenMask = null;

  Popover.prototype.closeMode = 'close';

  Popover.prototype.role = 'tooltip';

  Popover.prototype.afterInit = function() {
    Popover.__super__.afterInit.call(this);
    this.screenMask = new ScreenMask((function(_this) {
      return function() {
        _this.sleep();
      };
    })(this));
  };

  Popover.prototype.beforeRender = function() {
    Popover.__super__.beforeRender.apply(this, arguments);
    this.el.addClass("in " + this.placement + " popover-" + this.type);
    this.el.set('html', '<div class="arrow"></div>' + '<h3 miwo-reference="titleEl" class="popover-title" style="display:none"></h3>' + '<div miwo-reference="contentEl" class="popover-content"></div>');
  };

  Popover.prototype.show = function() {
    this.screenMask.show();
    miwo.body.on('keydown', this.bound('onKeyDown'));
    Popover.__super__.show.call(this);
  };

  Popover.prototype.hide = function() {
    miwo.body.un('keydown', this.bound('onKeyDown'));
    this.screenMask.hide();
    Popover.__super__.hide.call(this);
  };

  Popover.prototype.sleep = function() {
    if (this.closeMode === 'hide') {
      this.hide();
    } else {
      this.close();
    }
  };

  Popover.prototype.afterRender = function() {
    Popover.__super__.afterRender.apply(this, arguments);
    if (this.title) {
      this.setTitle(this.title);
    }
    if (this.content) {
      this.setContent(this.content);
    }
  };

  Popover.prototype.onKeyDown = function(e) {
    if (e.key === 'esc') {
      this.sleep();
    }
  };

  Popover.prototype.setTitle = function(title) {
    this.title = title;
    if (this.rendered) {
      this.titleEl.set("html", title);
      this.titleEl.setVisible(title);
      this.updatePosition();
    }
  };

  Popover.prototype.setContent = function(content) {
    this.content = content;
    if (this.rendered) {
      this.contentEl.set("html", content);
      this.updatePosition();
    }
  };

  Popover.prototype.addedComponent = function(component) {
    if (this.rendered) {
      this.updatePosition();
    }
  };

  Popover.prototype.removedComponent = function(component) {
    if (this.rendered) {
      this.updatePosition();
    }
  };

  Popover.prototype.doDestroy = function() {
    this.screenMask.destroy();
    Popover.__super__.doDestroy.call(this);
  };

  return Popover;

})(BaseTip);

module.exports = Popover;


},{"../utils/ScreenMask":131,"./BaseTip":121}],124:[function(require,module,exports){
var BaseTipManager, Popover, PopoverManager,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

BaseTipManager = require('./BaseTipManager');

Popover = require('./Popover');

PopoverManager = (function(_super) {
  __extends(PopoverManager, _super);

  function PopoverManager() {
    return PopoverManager.__super__.constructor.apply(this, arguments);
  }

  PopoverManager.prototype.selector = '[data-toggle="popover"]';

  PopoverManager.prototype.create = function(target, config) {
    var container, content, delay, distance, placement, popover, title;
    if (config == null) {
      config = {};
    }
    if (!target) {
      throw new Error("Target is not defined");
    }
    title = config.title || target.get("data-title") || target.get("title");
    content = config.content || target.get("data-content") || '';
    container = config.container || target.get("data-container");
    placement = config.placement || target.get("data-placement") || this.placement;
    distance = config.distance || target.get("data-distance") || this.distance;
    delay = config.delay || target.get("data-delay") || this.delay;
    if (!title) {
      return;
    }
    popover = new Popover({
      target: target,
      title: title,
      content: content,
      container: container,
      placement: placement,
      distance: distance
    });
    return popover;
  };

  return PopoverManager;

})(BaseTipManager);

module.exports = PopoverManager;


},{"./BaseTipManager":122,"./Popover":123}],125:[function(require,module,exports){
var BaseTip, Tooltip,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

BaseTip = require('./BaseTip');

Tooltip = (function(_super) {
  __extends(Tooltip, _super);

  function Tooltip() {
    return Tooltip.__super__.constructor.apply(this, arguments);
  }

  Tooltip.prototype.text = null;

  Tooltip.prototype.baseCls = 'tooltip';

  Tooltip.prototype.role = 'tooltip';

  Tooltip.prototype.setText = function(text) {
    this.text = text;
    if (this.rendered) {
      this.contentEl.set('html', text);
      this.updatePosition();
    }
    return this;
  };

  Tooltip.prototype.beforeRender = function() {
    Tooltip.__super__.beforeRender.apply(this, arguments);
    this.el.addClass("in " + this.placement + " tooltip-" + this.type);
    this.el.set('html', '<div class="tooltip-arrow"></div><div miwo-reference="contentEl" class="tooltip-inner"></div>');
  };

  Tooltip.prototype.afterRender = function() {
    Tooltip.__super__.afterRender.apply(this, arguments);
    if (this.text) {
      this.setText(this.text);
    }
  };

  return Tooltip;

})(BaseTip);

module.exports = Tooltip;


},{"./BaseTip":121}],126:[function(require,module,exports){
var BaseTipManager, Tooltip, TooltipManager,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

BaseTipManager = require('./BaseTipManager');

Tooltip = require('./Tooltip');

TooltipManager = (function(_super) {
  __extends(TooltipManager, _super);

  function TooltipManager() {
    return TooltipManager.__super__.constructor.apply(this, arguments);
  }

  TooltipManager.prototype.create = function(target, config) {
    var container, delay, distance, item, placement, selector, title, tooltip;
    if (config == null) {
      config = {};
    }
    title = config.title || target.get("data-title") || target.get("title");
    container = config.container || target.get("data-container");
    placement = config.placement || target.get("data-placement") || this.placement;
    distance = config.distance || target.get("data-distance") || this.distance;
    delay = config.delay || target.get("data-delay") || this.delay;
    if (!title && (selector = target.get('data-title-el')) && (item = target.getElement(selector))) {
      title = item.get('html');
    }
    if (!title) {
      return;
    }
    tooltip = new Tooltip({
      target: target,
      text: title,
      placement: placement,
      distance: distance
    });
    return tooltip;
  };

  return TooltipManager;

})(BaseTipManager);

module.exports = TooltipManager;


},{"./BaseTipManager":122,"./Tooltip":125}],127:[function(require,module,exports){
module.exports = {
  BaseTip: require('./BaseTip'),
  Popover: require('./Popover'),
  Tooltip: require('./Tooltip')
};


},{"./BaseTip":121,"./Popover":123,"./Tooltip":125}],128:[function(require,module,exports){
module.exports = {
  nav: {
    prev: 'Previous',
    next: 'Next',
    current: 'Current'
  },
  grid: {
    execute: 'Do',
    confirm: 'Confirm'
  },
  dialog: {
    ok: 'Ok',
    cancel: 'Cancel'
  },
  window: {
    close: 'Close window',
    hide: 'Hide window'
  },
  picker: {
    selectColor: 'Select color',
    today: 'Today',
    clear: 'Clear'
  },
  inputs: {
    dateTo: 'to',
    switchOn: 'ON',
    switchOff: 'OFF'
  },
  pagination: {
    pageInfo: 'Visible: {visible} Total: {total}'
  }
};


},{}],129:[function(require,module,exports){
var Color;

Color = (function() {
  function Color() {}

  Color.prototype.r = 0;

  Color.prototype.g = 0;

  Color.prototype.b = 0;

  Color.prototype.h = 0;

  Color.prototype.s = 0;

  Color.prototype.v = 0;

  Color.prototype.hex = "";

  Color.prototype.setRgb = function(r, g, b) {
    var hsv;
    if (r !== null) {
      this.r = r;
    }
    if (g !== null) {
      this.g = g;
    }
    if (b !== null) {
      this.b = b;
    }
    hsv = Color.rgbToHsv(this);
    this.h = hsv.h;
    this.s = hsv.s;
    this.v = hsv.v;
    this.hex = Color.rgbToHex(this);
  };

  Color.prototype.setHsv = function(h, s, v) {
    var rgb;
    if (h !== null) {
      this.h = h;
    }
    if (s !== null) {
      this.s = s;
    }
    if (v !== null) {
      this.v = v;
    }
    rgb = Color.hsvToRgb(this);
    this.r = rgb.r;
    this.g = rgb.g;
    this.b = rgb.b;
    this.hex = Color.rgbToHex(rgb);
  };

  Color.prototype.setHex = function(hex) {
    var hsv, rgb;
    this.hex = hex;
    rgb = Color.hexToRgb(this.hex);
    this.r = rgb.r;
    this.g = rgb.g;
    this.b = rgb.b;
    hsv = Color.rgbToHsv(rgb);
    this.h = hsv.h;
    this.s = hsv.s;
    this.v = hsv.v;
  };

  return Color;

})();

Color.fromRgb = function(r, g, b) {
  var object;
  object = new Color();
  object.setRgb(r, g, b);
  return object;
};

Color.fromHsv = function(h, s, v) {
  var object;
  object = new Color();
  object.setHsv(h, s, v);
  return object;
};

Color.fromHex = function(hex) {
  var object;
  object = new Color();
  object.setHex(hex);
  return object;
};

Color.rgbToHex = function(rgb) {
  return this.intToHex(rgb.r) + this.intToHex(rgb.g) + this.intToHex(rgb.b);
};

Color.hexToRgb = function(hex) {
  var b, g, r;
  r = "00";
  g = "00";
  b = "00";
  if (hex.length === 6) {
    r = hex.substring(0, 2);
    g = hex.substring(2, 4);
    b = hex.substring(4, 6);
  } else {
    if (hex.length > 4) {
      r = hex.substring(4, hex.length);
      hex = hex.substring(0, 4);
    }
    if (hex.length > 2) {
      g = hex.substring(2, hex.length);
      hex = hex.substring(0, 2);
    }
    if (hex.length > 0) {
      b = hex.substring(0, hex.length);
    }
  }
  return {
    r: this.hexToInt(r),
    g: this.hexToInt(g),
    b: this.hexToInt(b)
  };
};

Color.hsvToRgb = function(hsv) {
  var f, h, i, p, q, rgb, s, t, v;
  rgb = {
    r: 0,
    g: 0,
    b: 0
  };
  h = hsv.h;
  s = hsv.s;
  v = hsv.v;
  if (s === 0) {
    if (v === 0) {
      rgb.r = rgb.g = rgb.b = 0;
    } else {
      rgb.r = rgb.g = rgb.b = parseInt(v * 255 / 100, 10);
    }
  } else {
    if (h === 360) {
      h = 0;
    }
    h /= 60;
    s = s / 100;
    v = v / 100;
    i = parseInt(h, 10);
    f = h - i;
    p = v * (1 - s);
    q = v * (1 - (s * f));
    t = v * (1 - (s * (1 - f)));
    switch (i) {
      case 0:
        rgb.r = v;
        rgb.g = t;
        rgb.b = p;
        break;
      case 1:
        rgb.r = q;
        rgb.g = v;
        rgb.b = p;
        break;
      case 2:
        rgb.r = p;
        rgb.g = v;
        rgb.b = t;
        break;
      case 3:
        rgb.r = p;
        rgb.g = q;
        rgb.b = v;
        break;
      case 4:
        rgb.r = t;
        rgb.g = p;
        rgb.b = v;
        break;
      case 5:
        rgb.r = v;
        rgb.g = p;
        rgb.b = q;
    }
    rgb.r = parseInt(rgb.r * 255, 10);
    rgb.g = parseInt(rgb.g * 255, 10);
    rgb.b = parseInt(rgb.b * 255, 10);
  }
  return rgb;
};

Color.rgbToHsv = function(rgb) {
  var b, delta, g, hsv, max, min, r;
  r = rgb.r / 255;
  g = rgb.g / 255;
  b = rgb.b / 255;
  hsv = {
    h: 0,
    s: 0,
    v: 0
  };
  min = 0;
  max = 0;
  if (r >= g && r >= b) {
    max = r;
    min = (g > b ? b : g);
  } else if (g >= b && g >= r) {
    max = g;
    min = (r > b ? b : r);
  } else {
    max = b;
    min = (g > r ? r : g);
  }
  hsv.v = max;
  hsv.s = (max ? (max - min) / max : 0);
  if (!hsv.s) {
    hsv.h = 0;
  } else {
    delta = max - min;
    if (r === max) {
      hsv.h = (g - b) / delta;
    } else if (g === max) {
      hsv.h = 2 + (b - r) / delta;
    } else {
      hsv.h = 4 + (r - g) / delta;
    }
    hsv.h = parseInt(hsv.h * 60, 10);
    if (hsv.h < 0) {
      hsv.h += 360;
    }
  }
  hsv.s = parseInt(hsv.s * 100, 10);
  hsv.v = parseInt(hsv.v * 100, 10);
  return hsv;
};

Color.hexToInt = function(hex) {
  return parseInt(hex, 16);
};

Color.intToHex = function(dec) {
  var result;
  result = parseInt(dec, 10).toString(16);
  if (result.length === 1) {
    result = "0" + result;
  }
  return result.toUpperCase();
};

module.exports = Color;


},{}],130:[function(require,module,exports){
var Paginator,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Paginator = (function(_super) {
  __extends(Paginator, _super);

  function Paginator() {
    return Paginator.__super__.constructor.apply(this, arguments);
  }

  Paginator.prototype.base = 1;

  Paginator.prototype.itemsPerPage = 1;

  Paginator.prototype.page = null;

  Paginator.prototype.itemCount = null;

  Paginator.prototype.getFirstPage = function() {
    return this.base;
  };

  Paginator.prototype.getLastPage = function() {
    if (this.itemCount === null) {
      return null;
    } else {
      return this.base + Math.max(0, this.getPageCount() - 1);
    }
  };

  Paginator.prototype.isFirst = function() {
    return this.page === 1 || this.page === null;
  };

  Paginator.prototype.isLast = function() {
    if (this.itemCount === null) {
      return true;
    } else {
      return this.page === this.getLastPage();
    }
  };

  Paginator.prototype.getPageCount = function() {
    if (this.itemCount === null) {
      return null;
    } else {
      return Math.ceil(this.itemCount / this.itemsPerPage);
    }
  };

  Paginator.prototype.setItemsPerPage = function(itemsPerPage) {
    this.itemsPerPage = Math.max(1, parseInt(itemsPerPage));
    this.emit('itemsperpage', this, this.itemsPerPage);
    return this;
  };

  Paginator.prototype.setItemCount = function(itemCount) {
    this.itemCount = Math.max(0, parseInt(itemCount));
    this.emit('itemcount', this, this.itemCount);
    return this;
  };

  Paginator.prototype.setPage = function(page) {
    page = parseInt(page);
    if (page !== this.page) {
      this.page = page;
      this.emit('page', this, this.page);
    }
    return this;
  };

  return Paginator;

})(Miwo.Object);

module.exports = Paginator;


},{}],131:[function(require,module,exports){
var ScreenMask;

ScreenMask = (function() {
  function ScreenMask(handler) {
    this.el = new Element('div', {
      cls: 'screen-mask'
    });
    this.el.on('click', (function(_this) {
      return function(event) {
        event.stop();
        handler();
      };
    })(this));
    return;
  }

  ScreenMask.prototype.show = function() {
    this.el.inject(miwo.body);
  };

  ScreenMask.prototype.hide = function() {
    this.el.dispose();
  };

  ScreenMask.prototype.destroy = function() {
    this.hide();
    this.el.destroy();
  };

  return ScreenMask;

})();

module.exports = ScreenMask;


},{}],132:[function(require,module,exports){
module.exports = {
  ScreenMask: require('./ScreenMask'),
  Color: require('./Color')
};


},{"./Color":129,"./ScreenMask":131}],133:[function(require,module,exports){
var Dialog, Window,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Window = require('./Window');

Dialog = (function(_super) {
  __extends(Dialog, _super);

  function Dialog() {
    return Dialog.__super__.constructor.apply(this, arguments);
  }

  Dialog.prototype.xtype = 'dialog';

  Dialog.prototype.role = 'dialog';

  Dialog.prototype.beforeInit = function() {
    Dialog.__super__.beforeInit.call(this);
    this.closeOnClickOut = true;
    this.closeMode = "close";
    this.componentCls = "miwo-dialog";
  };

  Dialog.prototype.afterRender = function() {
    Dialog.__super__.afterRender.call(this);
    this.keyListener.on('enter', (function(_this) {
      return function() {
        var button, _i, _len, _ref;
        _ref = _this.buttons;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          button = _ref[_i];
          if (button.type === 'primary') {
            button.click();
            break;
          }
        }
      };
    })(this));
  };

  return Dialog;

})(Window);

module.exports = Dialog;


},{"./Window":136}],134:[function(require,module,exports){
var Button, Dialog, DialogFactory;

Dialog = require('./Dialog');

Button = require('../buttons/Button');

DialogFactory = (function() {
  function DialogFactory() {}

  DialogFactory.prototype.createDialog = function(title, message, buttons) {
    var dialog;
    dialog = new Dialog();
    dialog.render(miwo.body);
    dialog.setTitle(title);
    dialog.setContent("<p class='text-center'>" + message + "</p>");
    dialog.setButtons(buttons);
    dialog.show();
    return dialog;
  };

  DialogFactory.prototype.alert = function(title, message, cb, btnText) {
    var dialog, okBtn;
    okBtn = new Button({
      name: 'ok',
      type: "primary",
      text: (btnText ? btnText : miwo.tr("miwo.dialog.ok")),
      handler: function() {
        if (cb) {
          cb(true);
        }
        dialog.close();
      }
    });
    dialog = this.createDialog(title, message, [okBtn]);
    return dialog;
  };

  DialogFactory.prototype.prompt = function(title, message, cb, okBtnText, noBtnText) {
    var cancelBtn, dialog, okBtn;
    okBtn = new Button({
      name: 'ok',
      type: "primary",
      text: (okBtnText ? okBtnText : miwo.tr("miwo.dialog.ok")),
      handler: function() {
        if (cb) {
          cb(true);
        }
        dialog.close();
      }
    });
    cancelBtn = new Button({
      name: 'cancel',
      type: 'default',
      text: (noBtnText ? noBtnText : miwo.tr("miwo.dialog.cancel")),
      handler: function() {
        if (cb) {
          cb(false);
        }
        dialog.close();
      }
    });
    dialog = this.createDialog(title, message, [okBtn, cancelBtn]);
    return dialog;
  };

  DialogFactory.prototype.promptIf = function(title, message, cb, okBtnText, noBtnText) {
    var dialog;
    dialog = this.prompt(title, message, (function(state) {
      if (cb && state) {
        cb();
      }
    }), okBtnText, noBtnText);
    return dialog;
  };

  return DialogFactory;

})();

module.exports = DialogFactory;


},{"../buttons/Button":6,"./Dialog":133}],135:[function(require,module,exports){
var Form, FormWindow, Window,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Window = require('./Window');

Form = require('../form/container/Form');

FormWindow = (function(_super) {
  __extends(FormWindow, _super);

  function FormWindow() {
    return FormWindow.__super__.constructor.apply(this, arguments);
  }

  FormWindow.getter('form', function() {
    return this.getForm();
  });

  FormWindow.prototype.doInit = function() {
    var form;
    FormWindow.__super__.doInit.apply(this, arguments);
    form = this.add('form', new Form);
    form.on('submit', (function(_this) {
      return function(form, isValid) {
        return _this.emit('submit', _this, form, isValid);
      };
    })(this));
    form.on('success', (function(_this) {
      return function(form) {
        return _this.emit('success', _this, form);
      };
    })(this));
    form.on('failure', (function(_this) {
      return function(form) {
        return _this.emit('failure', _this, form);
      };
    })(this));
  };

  FormWindow.prototype.getForm = function() {
    return this.get('form');
  };

  FormWindow.prototype.setFocus = function() {
    FormWindow.__super__.setFocus.call(this);
    this.getForm().getFocusControl().setFocus();
  };

  FormWindow.prototype.addSubmitButton = function(text) {
    return this.addButton('submit', {
      text: text,
      type: 'primary',
      handler: (function(_this) {
        return function() {
          return _this.getForm().submit();
        };
      })(this)
    });
  };

  return FormWindow;

})(Window);

module.exports = FormWindow;


},{"../form/container/Form":24,"./Window":136}],136:[function(require,module,exports){
var Button, ToolButton, Window,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Button = require('../buttons/Button');

ToolButton = require('../buttons/ToolButton');

Window = (function(_super) {
  __extends(Window, _super);

  function Window() {
    return Window.__super__.constructor.apply(this, arguments);
  }

  Window.prototype.isWindow = true;

  Window.prototype.xtype = 'window';

  Window.prototype.baseCls = 'window';

  Window.prototype.closeMode = 'hide';

  Window.prototype.closeOnClickOut = true;

  Window.prototype.closeOnEsc = true;

  Window.prototype.closeable = true;

  Window.prototype.minimizable = false;

  Window.prototype.title = '';

  Window.prototype.autoCenter = true;

  Window.prototype.preventAutoRender = true;

  Window.prototype.width = 600;

  Window.prototype.top = 30;

  Window.prototype.modal = true;

  Window.prototype.zIndexManage = true;

  Window.prototype.visible = false;

  Window.prototype.buttons = null;

  Window.prototype.titleEl = null;

  Window.prototype.contentEl = null;

  Window.prototype.footerEl = null;

  Window.prototype.toolsEl = null;

  Window.prototype.keyListener = null;

  Window.prototype.tools = null;

  Window.prototype.beforeInit = function() {
    Window.__super__.beforeInit.call(this);
    this.renderTo = miwo.body;
    this.buttons = new Miwo.utils.Collection();
    this.tools = new Miwo.utils.Collection();
  };

  Window.prototype.afterInit = function() {
    Window.__super__.afterInit.call(this);
    miwo.windowMgr.register(this);
    this.contentHeight = this.height;
    this.height = null;
    this.keyListener = new Miwo.utils.KeyListener(this.el);
    this.keyListener.on('esc', (function(_this) {
      return function() {
        if (_this.closeOnEsc) {
          _this.close();
        }
      };
    })(this));
  };

  Window.prototype.open = function() {
    this.show();
  };

  Window.prototype.close = function(destroy, silent) {
    if (destroy == null) {
      destroy = false;
    }
    if (!destroy && this.closeMode === 'hide') {
      this.doHide();
    } else {
      this.preventClose = false;
      if (!silent) {
        this.emit('beforeclose', this);
      }
      if (this.preventClose) {
        return;
      }
      this.doClose();
      this.emit('close', this);
      this.destroy();
    }
  };

  Window.prototype.setTitle = function(title) {
    this.title = title;
    if (this.titleEl) {
      this.titleEl.set("html", title);
    }
  };

  Window.prototype.doShow = function() {
    Window.__super__.doShow.apply(this, arguments);
    this.toFront();
  };

  Window.prototype.doHide = function() {
    Window.__super__.doHide.apply(this, arguments);
    this.toBack();
  };

  Window.prototype.doClose = function() {
    this.hide();
  };

  Window.prototype.beforeRender = function() {
    Window.__super__.beforeRender.call(this);
    this.el.addClass('modal-dialog');
    this.el.set('html', "<div class=\"window-content modal-content\">\n	<div miwo-reference=\"headerEl\" class=\"window-header modal-header\">\n		<div miwo-reference=\"toolsEl\" class='window-tools'></div>\n		<h4 miwo-reference=\"titleEl\" class='window-title modal-title'>" + this.title + "</h4>\n	</div>\n	<div miwo-reference=\"contentEl\" class=\"window-body modal-body\"></div>\n	<div miwo-reference=\"footerEl\" class=\"window-footer modal-footer\"></div>\n</div>");
  };

  Window.prototype.afterRender = function() {
    var button, name, _ref;
    Window.__super__.afterRender.call(this);
    if (this.wasRendered) {
      return;
    }
    this.el.set('aria-labelledby', this.id + 'Label');
    this.titleEl.set('id', this.id + 'Label');
    if (this.contentHeight) {
      this.contentEl.setStyle('height', this.contentHeight);
    }
    if (this.closeable) {
      this.addTool('close', {
        icon: 'remove',
        text: miwo.tr('miwo.window.close'),
        handler: (function(_this) {
          return function() {
            return _this.close();
          };
        })(this)
      });
    }
    if (this.minimizable) {
      this.addTool('hide', {
        icon: 'minus',
        text: miwo.tr('miwo.window.hide'),
        handler: (function(_this) {
          return function() {
            return _this.hide();
          };
        })(this)
      });
    }
    _ref = this.buttons.items;
    for (name in _ref) {
      button = _ref[name];
      if (!button.rendered) {
        button.render(this.footerEl);
      }
    }
    if (!this.modal) {
      miwo.body.on('click', this.bound('onBodyClick'));
    }
  };

  Window.prototype.onBodyClick = function(e) {
    if (this.isVisible() && e.target === this.el) {
      return;
    }
    if (e.target.getParent('.window') === this.el) {
      return;
    }
    if (this.closeOnClickOut) {
      this.close();
    }
  };

  Window.prototype.onOverlayClick = function() {
    if (this.closeOnClickOut) {
      this.close();
    }
  };

  Window.prototype.setContent = function(string) {
    this.contentEl.set("html", string);
  };

  Window.prototype.setButtons = function(buttons) {
    var button, _i, _j, _len, _len1, _ref;
    _ref = this.buttons;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      button = _ref[_i];
      button.destroy();
    }
    this.buttons.empty();
    for (_j = 0, _len1 = buttons.length; _j < _len1; _j++) {
      button = buttons[_j];
      this.addButton(button.name, button);
    }
  };

  Window.prototype.addButton = function(name, button) {
    if (!Type.isInstance(button)) {
      button = new Button(button);
    }
    this.buttons.set(name, button);
    button.on('click', (function(_this) {
      return function() {
        _this.emit('action', _this, name);
      };
    })(this));
    if (this.footerEl) {
      button.render(this.footerEl);
    }
    return button;
  };

  Window.prototype.addCloseButton = function(text) {
    return this.addButton('close', {
      text: text,
      handler: (function(_this) {
        return function() {
          return _this.close();
        };
      })(this)
    });
  };

  Window.prototype.getButton = function(name) {
    return this.buttons.get(name);
  };

  Window.prototype.addTool = function(name, button) {
    if (!Type.isInstance(button)) {
      button = new ToolButton(button);
    }
    this.tools.set(name, button);
    button.render(this.toolsEl);
    return button;
  };

  Window.prototype.getTool = function(name) {
    return this.tools.get(name);
  };

  Window.prototype.doDestroy = function() {
    miwo.windowMgr.unregister(this);
    miwo.body.un('click', this.bound('onBodyClick'));
    if (this.keyListener) {
      this.keyListener.destroy();
    }
    this.buttons.destroy();
    this.tools.destroy();
    Window.__super__.doDestroy.call(this);
  };

  return Window;

})(Miwo.Container);

module.exports = Window;


},{"../buttons/Button":6,"../buttons/ToolButton":10}],137:[function(require,module,exports){
var WindowManager;

WindowManager = (function() {
  WindowManager.prototype.list = null;

  function WindowManager() {
    this.list = new Miwo.utils.Collection();
    return;
  }

  WindowManager.prototype.register = function(comp) {
    if (comp.windowMgr) {
      comp.windowMgr.unregister(comp);
    }
    comp.windowMgr = this;
    this.list.set(comp.id, comp);
  };

  WindowManager.prototype.unregister = function(comp) {
    if (this.list.has(comp.id)) {
      this.list.remove(comp.id);
      delete comp.windowMgr;
    }
  };

  WindowManager.prototype.get = function(id) {
    return this.list.get(id);
  };

  WindowManager.prototype.getBy = function(name, value) {
    return this.list.getBy(name, value);
  };

  return WindowManager;

})();

module.exports = WindowManager;


},{}],138:[function(require,module,exports){
module.exports = {
  Window: require('./Window'),
  FormWindow: require('./FormWindow'),
  Dialog: require('./Dialog')
};


},{"./Dialog":133,"./FormWindow":135,"./Window":136}]},{},[65])