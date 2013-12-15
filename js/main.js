
(function (buttonID, $) {
    'use strict';

    $.extend({
        interpolate: function (s, data) {
            var variable;
            for (variable in data) {
                if (data.hasOwnProperty(variable)) {
                    s = s.replace(new RegExp('{' + variable + '}', 'g'), data[variable]);
                }
            }

            return s;
        }
    });

    function handleGallery2Response(data) {
        var lines = data.split('\n'),
            pattern = /^image\.(.+)\.(\d+)$/,
            template = '<a href="/gallery2/d/{name}-2/{title}" title="{description}" rel="lightbox[g2image]"><img src="/gallery2/d/{resized.2.name}-2/{title}" srcset="/gallery2/d/{resized.2.name}-2/{title} 1x, /gallery2/d/{resized.1.name}-2/{title} 2x" alt="{caption}" width="{resized.2.width}" height="{resized.2.height}"/></a>',
            images = [];

        $('#container').empty();

        $.each(lines, function () {
            var keyVal = this.split('='),
                parsedKey,
                fieldName,
                imageIndex,
                image;

            if (pattern.test(keyVal[0])) {
                parsedKey = pattern.exec(keyVal[0]);
                fieldName = parsedKey[1];
                imageIndex = parsedKey[2] - 1;

                image = images[imageIndex] || {};

                image[fieldName] = keyVal[1];

                images[imageIndex] = image;
            }
        });

        $.each(images, function (i) {
            if (this['extrafield.Description']) {
                this.description = this['extrafield.Description'];
            } else {
                this.description = this.caption;
            }

            if (!this['resized.1.name']) {
                console.warn($.interpolate('{title} with ID {name} is missing HiDPI resize', this));
            }

            if (!this['resized.2.name']) {
                console.warn($.interpolate('{title} with ID {name} is missing default resize', this));
            }

            images[i] = this;
        });

function removeEscapes(s) {
  if (typeof s !== 'string') {
    return s;
  }

  return s.replace(/\\/g, '');
}

function objectMap(obj, f) {
  var key, newObj = {};
  for (key in obj) {
    if (obj.hasOwnProperty(key)) {
      newObj[key] = f(obj[key]);
    }
  }
  return newObj;
}

        $.each(images, function () {
            var data = objectMap(this, removeEscapes),
                wrapperTmpl = '<li><span class="image">{img}</span><span class="description"><h2>{caption}</h2><div>{description}</div><span class="html">{html}</span></span></li>',
                inter = $.extend({
                    img: $.interpolate(template, data),
                    html: ''
                }, data),
                $dom = $($.interpolate(wrapperTmpl, inter));

            $dom.find('span.html').text(inter.img);

            $('#container').append($dom);
        });
    }

    $(document).ready(function() {
	    $('form').on('submit', function (e) {
		    $.post('/gallery2/main.php?g2_controller=remote:GalleryRemote', {
		        'g2_form[cmd]': 'fetch-album-images',
		        'g2_form[protocol_version]': '2.4',
		        'g2_form[set_albumName]': $('#galleryID').val(),
		        'g2_form[albums_too]': 'no',
		        'g2_form[random]': 'no',
		        'g2_form[extrafields]': 'yes',
		        'g2_form[all_sizes]': 'yes'
		    }, handleGallery2Response);

                e.preventDefault();
	    });
            $('#galleryID').focus();
            $('#container').on('mouseenter mouseleave', 'li', function (e) {
                var sel = window.getSelection(),
                    range,
                    node;
                if (e.type === 'mouseleave') {
                    sel.removeAllRanges();
                } else if (e.type === 'mouseenter') {
                    range = document.createRange();
                    node = $(this).find('span.html')[0].childNodes[0];
                    
                    range.setStart(node, 0);
                    range.setEnd(node, node.length);

                    sel.removeAllRanges();
                    sel.addRange(range);
                }
            });
    });
}('#doIt', jQuery));

