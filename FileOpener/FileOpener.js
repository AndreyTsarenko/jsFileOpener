/**
 * Created by HoldenCaulfield on 05.06.2014.
 */
(function () {
    var $FileOpener = function (conf) {
        conf.RenderTo;
        conf.MimeTypes;//array
        conf.multiple;
        conf.list;
        conf.label;
        conf.onActiveItemChanged;
        /**
         *
         */
        var input = document.createElement('input'),
            InputContainer = document.createElement('div'),
            Files = {},
            Items,
            ActiveItem,
            ul = document.createElement('ul'),
            count = 0,
            li,
            setActiveItem, getFileFromItem,
            getActiveItemIndex;
        Items = conf.RenderTo.getElementsByClassName('Item');
        input.setAttribute('type', 'file');
        input.setAttribute('class', 'FileOpener');
        input.setAttribute('accept', conf.MimeTypes.join(','));
        InputContainer.setAttribute('class', 'FileInputContainer');
        InputContainer.innerText = conf.label || 'OpenFiles';
        InputContainer.appendChild(input);
        ul.setAttribute('class', 'ListContainer');
        conf.multiple && input.setAttribute('multiple', conf.multiple);
        conf.RenderTo.appendChild(InputContainer);
        if (conf.list) {
            conf.RenderTo.appendChild(ul);
        }
        /**
         *
         */
        getFileFromItem = function (item) {
            if (item) {
                var id = item.getAttribute('data-main');
                return Files[id];
            }
        };
        /**
         *
         * @param Item
         */
        setActiveItem = function (Item) {
            var classes;
            if (ActiveItem) {
                classes = ActiveItem.getAttribute('class').split(' ');
                classes.splice(classes.indexOf('active', 1));
                classes = classes.join(' ');
                ActiveItem.setAttribute('class', classes);
            }
            ActiveItem = Item;
            ActiveItem.setAttribute('class',
                    ActiveItem.getAttribute('class') + ' active');
        };
        /**
         *
         */
        input.addEventListener('change', function (e) {
            var i, id,
                files = e.target.files;
            for (i = 0; i < files.length; i++) {
                id = 'file-' + count++;
                li = document.createElement('li');
                li.setAttribute('class', 'Item');
                li.setAttribute('data-main', id);
                li.innerText = files[i].name;
                Files[id] = files[i];
                ul.appendChild(li);
                if (!ActiveItem) {
                    setActiveItem(li);
                }
            }
        });
        /**
         *
         */
        getActiveItemIndex = function () {
            var i, len, to_return = -1;
            for (i = 0, len = Items.length; i < len; i++) {
                if (ActiveItem === Items[i]) {
                    to_return = i;
                    break;
                }
            }
            return to_return;
        };
        /**
         *
         */
        this.getRandomFile = function () {
            var item = Items[parseInt(Math.random() * (Items.length - 1))];
            setActiveItem(item);
            return getFileFromItem(item);
        };
        /**
         *
         */
        this.getPrewFile = function () {
            var index = getActiveItemIndex(),
                item = Items[--index];
            if (item) {
                setActiveItem(item);
                return getFileFromItem(item);
            }
        };
        /**
         *
         */
        this.getNexFile = function () {
            var index = getActiveItemIndex(),
                item = Items[++index];
            if (item) {
                setActiveItem(item);
                return getFileFromItem(item);
            }
        };
        /**
         *
         */
        ul.addEventListener('click', function (e) {
            setActiveItem(e.target);
            conf.onActiveItemChanged && conf.onActiveItemChanged(getFileFromItem(e.target));
            e.stopPropagation();
        });
        /**
         *
         */
        this.getActiveFile = function () {
            var id = ActiveItem.getAttribute('data-main');
            return Files[id];
        };
        /**
         *
         */
        this.getFiles = function () {
            var to_return = [],
                key;
            for (key in Files) {
                to_return.push(Files[key]);
            }
            return to_return;
        };
        /**
         *
         */
        this.input = input;
    };
    if (window.define) {
        window.define([], function () {
            return $FileOpener;
        })
    } else {
        window.$FileOpener = $FileOpener;
    }
})();