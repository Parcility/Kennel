const fs = require("fs");
const Kennel = require("../dist/Kennel");
const depiction = {
    "minVersion": "0.1",
    "headerImage": "https://prcl.app/assets/missing.png",
    "tintColor": "#6264D3",
    "tabs": [
        {
            "tabname": "Introduction",
            "views": [
                {
                    "class": "DepictionHeaderView",
                    "title": "About"
                },
                {
                    "class": "DepictionMarkdownView",
                    "markdown": "This is a demonstration of the features of Sileo's native depictions. It's primary meant as a demonstration of what's possible."
                },
                {
                    "class": "DepictionMarkdownView",
                    "markdown": "View the **Demo** tab to see all the known classes and how to implement them."
                }
            ],
            "class": "DepictionStackView"
        },
        {
            "tabname": "Demo",
            "views": [
                {
                    "class": "DepictionHeaderView",
                    "title": "DepictionHeaderView"
                },
                {
                    "class": "DepictionHeaderView",
                    "title": "center bold margin",
                    "useMargins": true,
                    "useBottomMargin": true,
                    "useBoldText": true,
                    "alignment": 1
                },
                {
                    "class": "DepictionHeaderView",
                    "title": "right unbold",
                    "useBoldText": false,
                    "alignment": 2
                },
                {
                    "class": "DepictionHeaderView",
                    "title": "This is a normal header but super long for no reason to test elipsis."
                },
                {
                    "class": "DepictionSeparatorView"
                },

                {
                    "class": "DepictionHeaderView",
                    "title": "DepictionSubheaderView"
                },
                {
                    "class": "DepictionSubheaderView",
                    "title": "center bold margin",
                    "useMargins": true,
                    "useBottomMargin": true,
                    "useBoldText": true,
                    "alignment": 1
                },
                {
                    "class": "DepictionSubheaderView",
                    "title": "right unbold",
                    "useBoldText": false,
                    "alignment": 2
                },
                {
                    "class": "DepictionSubheaderView",
                    "title": "This is a normal subheader but super long for no reason to test elipsis."
                },
                {
                    "class": "DepictionSeparatorView"
                },

                {
                    "class": "DepictionHeaderView",
                    "title": "DepictionLabelView"
                },
                {
                    "class": "DepictionLabelView",
                    "text": "A boring label."
                },
                {
                    "class": "DepictionLabelView",
                    "text": "A red, uber-bold label.",
                    "textColor": "#ff0000",
                    "fontWeight": "heavy"
                },
                {
                    "class": "DepictionLabelView",
                    "text": "Margins {5, 50, 15, 15}",
                    "margins": "{5, 50, 15, 15}",
                    "useMargins": true
                },
                {
                    "class": "DepictionLabelView",
                    "text": "A thin and centered label.",
                    "alignment": 1,
                    "fontWeight": "thin"
                },
                {
                    "class": "DepictionLabelView",
                    "text": "A big right-aligned label (30.0).",
                    "alignment": 2,
                    "fontSize": 30.0
                },
                {
                    "class": "DepictionSeparatorView"
                },

                {
                    "class": "DepictionHeaderView",
                    "title": "DepictionMarkdownView"
                },
                {
                    "class": "DepictionMarkdownView",
                    "markdown": "**This** [is](https://shuga.co) ~~mark~~***down***!\n one newline.\n\ndouble newline\n\n# header tiem\n\n<h3 style='color:red'>html</h3>\n\n`code block`"
                },
                {
                    "class": "DepictionMarkdownView",
                    "markdown": "Raw HTML:\n\n<h3 style='color:red'>html</h3>\n\n<a href='https://shuga.co'>red tint color (this is link)</a>",
                    "useRawFormat": true,
                    "tintColor": "#ff0000"
                },
                {
                    "class": "DepictionSeparatorView"
                },

                {
                    "class": "DepictionHeaderView",
                    "title": "DepictionVideoView"
                },
                {
                    "class": "DepictionVideoView",
                    "URL": "https://shuga.co/giveupnow.mp4",
                    "width": 160.0,
                    "height": 90.0,
                    "cornerRadius": 10.0,
                    "alignment": 2
                },
                {
                    "class": "DepictionVideoView",
                    "URL": "https://shuga.co/giveupnow.mp4",
                    "width": 5000.0,
                    "height": 200.0,
                    "cornerRadius": 0.0,
                    "alignment": 1
                },
                {
                    "class": "DepictionSeparatorView"
                },

                {
                    "class": "DepictionHeaderView",
                    "title": "DepictionImageView"
                },
                {
                    "class": "DepictionImageView",
                    "URL": "https://shuga.co/logo.png",
                    "width": 160.0,
                    "height": 90.0,
                    "cornerRadius": 10.0,
                    "alignment": 2
                },
                {
                    "class": "DepictionImageView",
                    "URL": "https://shuga.co/fursona.png",
                    "width": 90.0,
                    "height": 160.0,
                    "cornerRadius": 10.0,
                    "alignment": 1
                },
                {
                    "class": "DepictionSeparatorView"
                },

                {
                    "class": "DepictionHeaderView",
                    "title": "DepictionScreenshotsView"
                },
                {
                    "class": "DepictionScreenshotsView",
                    "itemCornerRadius": 8,
                    "itemSize": "{125,200}",
                    "screenshots": [
                        {
                            "accessibilityText": "Some",
                            "url": "https://repo.shuga.co/assets/heyitsshuga.lunadarkmode/screenshot/01.png"
                        },
                        {
                            "accessibilityText": "body",
                            "url": "https://repo.shuga.co/assets/heyitsshuga.lunadarkmode/screenshot/03.png"
                        },
                        {
                            "accessibilityText": "once",
                            "url": "https://repo.shuga.co/assets/heyitsshuga.lunadarkmode/screenshot/02.png"
                        },
                        {
                            "accessibilityText": "told",
                            "url": "https://repo.shuga.co/assets/heyitsshuga.lunadarkmode/screenshot/05.png"
                        },
                        {
                            "accessibilityText": "me",
                            "url": "https://repo.shuga.co/assets/heyitsshuga.lunadarkmode/screenshot/04.PNG"
                        }
                    ]
                },
                {
                    "class": "DepictionSeparatorView"
                },

                {
                    "class": "DepictionHeaderView",
                    "title": "DepictionTableTextView"
                },
                {
                    "class": "DepictionTableTextView",
                    "title": "Title",
                    "text": "Text"
                },
                {
                    "class": "DepictionTableTextView",
                    "title": "Another DepictionTableTextView",
                    "text": "Indeed it is!"
                },
                {
                    "class": "DepictionTableTextView",
                    "title": "L",
                    "text": "R"
                },
                {
                    "class": "DepictionSeparatorView"
                },

                {
                    "class": "DepictionHeaderView",
                    "title": "DepictionTableButtonView"
                },
                {
                    "class": "DepictionTableButtonView",
                    "title": "Button label.",
                    "action": "https://shuga.co"
                },
                {
                    "class": "DepictionTableButtonView",
                    "title": "Red, open in new app.",
                    "action": "https://shuga.co",
                    "openExternal": 1,
                    "tintColor": "#ff0000"
                },
                {
                    "class": "DepictionTableButtonView",
                    "title": "Green, open in new app with bool.",
                    "action": "https://shuga.co",
                    "openExternal": true,
                    "tintColor": "#00ff00"
                },
                {
                    "class": "DepictionSeparatorView"
                },

                {
                    "class": "DepictionHeaderView",
                    "title": "DepictionButtonView"
                },
                {
                    "class": "DepictionButtonView",
                    "text": "UIButton-like.",
                    "action": "https://shuga.co"
                },
                {
                    "class": "DepictionButtonView",
                    "text": "Red, open in new app.",
                    "action": "https://shuga.co",
                    "openExternal": 1,
                    "tintColor": "#ff0000"
                },
                {
                    "class": "DepictionButtonView",
                    "text": "Green, open in new app with bool.",
                    "action": "https://shuga.co",
                    "openExternal": true,
                    "tintColor": "#00ff00"
                },
                {
                    "class": "DepictionSeparatorView"
                },

                {
                    "class": "DepictionHeaderView",
                    "title": "DepictionSpacerView and DepictionSeparatorView"
                },
                {
                    "class": "DepictionSpacerView",
                    "spacing": 20.0
                },
                {
                    "class": "DepictionSeparatorView"
                },
                {
                    "class": "DepictionSpacerView",
                    "spacing": 200.0
                },
                {
                    "class": "DepictionSeparatorView"
                },
                {
                    "class": "DepictionSeparatorView"
                },

                {
                    "class": "DepictionHeaderView",
                    "title": "DepictionRatingView"
                },
                {
                    "class": "DepictionRatingView",
                    "rating": 3,
                    "alignment": 0
                },
                {
                    "class": "DepictionRatingView",
                    "rating": 2.5,
                    "alignment": 1
                },
                {
                    "class": "DepictionRatingView",
                    "rating": 0.1,
                    "alignment": 2
                },
                {
                    "class": "DepictionSeparatorView"
                },

                {
                    "class": "DepictionHeaderView",
                    "title": "DepictionReviewView"
                },
                {
                    "class": "DepictionReviewView",
                    "title": "A review.",
                    "author": "Shuga",
                    "markdown": "### A brief Markdown snippet.\n\n**This** ~~is~~ [Mark***down***](https://shuga.co/)"
                },
                {
                    "class": "DepictionReviewView",
                    "title": "A review.",
                    "author": "Shuga",
                    "markdown": "[I, Shuga,](https://shuga.co/) reviewed this. Red tint. 3.5/5.",
                    "rating": 3.5,
                    "tintColor": "#ff0000"
                },
                {
                    "class": "DepictionSeparatorView"
                },


                {
                    "class": "DepictionHeaderView",
                    "title": "FeaturedBannersView"
                },
                {
                    "class": "FeaturedBannersView",
                    "itemCornerRadius": 8,
                    "itemSize": "{263, 148}",
                    "banners": [
                        {
                            "url": "https://repo.shuga.co/assets/co.shuga.oof-safe-mode/banner.png",
                            "title": "Oof Safe Mode Icon",
                            "hideShadow": "false",
                            "package": "co.shuga.oof-safe-mode"
                        },
                        {
                            "url": "https://repo.shuga.co/assets/com.marcusenzo.dbz/banner.png",
                            "title": "Dragon Ball Z",
                            "hideShadow": "false",
                            "package": "com.marcusenzo.dbz"
                        },
                        {
                            "url": "https://repo.shuga.co/assets/co.shuga.elementary-lite/banner.png",
                            "title": "Elementary Lite",
                            "hideShadow": "false",
                            "package": "co.shuga.elementary-lite"
                        },
                        {
                            "url": "https://repo.shuga.co/assets/co.shuga.Shuga-Sticker-Pack/banner.png",
                            "title": "Shuga Sticker Pack",
                            "hideShadow": "false",
                            "package": "co.shuga.Shuga-Sticker-Pack"
                        }
                    ]
                },
                {
                    "class": "DepictionSeparatorView"
                },


                {
                    "class": "DepictionHeaderView",
                    "title": "Abusing DepictionStackView"
                },
                {
                    "class": "DepictionStackView",
                    "orientation": "landscape",
                    "backgroundColor": "#fff",
                    "views": [
                        {
                            "class": "DepictionStackView",
                            "views": [
                                {
                                    "class": "DepictionButtonView",
                                    "text": "Button 1",
                                    "action": "https://shuga.co"
                                }
                            ]
                        },
                        {
                            "class": "DepictionStackView",
                            "views": [
                                {
                                    "class": "DepictionButtonView",
                                    "text": "Button 2",
                                    "action": "https://shuga.co",
                                    "tintColor": "#ff0000"
                                }
                            ]
                        },
                        {
                            "class": "DepictionStackView",
                            "views": [
                                {
                                    "class": "DepictionButtonView",
                                    "text": "Button 3",
                                    "action": "https://shuga.co"
                                }
                            ]
                        }
                    ]
                },
                {
                    "class": "DepictionSeparatorView"
                },

                {
                    "class": "DepictionHeaderView",
                    "title": "DepictionTabView"
                },
                {
                    "class": "DepictionTabView",
                    "tabs": [
                        {
                            "tabname": "button 1",
                            "class": "DepictionButtonView",
                            "text": "Button?",
                            "action": "https://shuga.co/"
                        },
                        {
                            "tabname": "button 2",
                            "class": "DepictionButtonView",
                            "text": "Button!",
                            "action": "https://shuga.co/"
                        }
                    ]
                },

                {
                    "class": "DepictionHeaderView",
                    "title": "DepictionWebView"
                },
                {
                    "width": 300,
                    "height": 200,
                    "URL": "https://www.youtube.com/embed/r6tq8whNIyI",
                    "alignment": 1,
                    "class": "DepictionWebView"
                },
                {
                    "width": 500,
                    "height": 500,
                    "URL": "https://www.youtube.com/",
                    "alignment": 2,
                    "class": "DepictionWebView"
                },
                {
                    "width": 500,
                    "height": 500,
                    "URL": "https://www.youtube.com/",
                    "alignment": 2,
                    "class": "DepictionWebView"
                },
                {
                    "width": 500,
                    "height": 200,
                    "URL": "https://shuga.co?url=youtube.com",
                    "alignment": 1,
                    "class": "DepictionWebView"
                },
                {
                    "width": 500,
                    "height": 200,
                    "URL": "https://shuga.co",
                    "alignment": 1,
                    "class": "DepictionWebView"
                },
                {
                    "width": 500,
                    "height": 200,
                    "URL": "https://notyoutube.com",
                    "alignment": 1,
                    "class": "DepictionWebView"
                },
                {
                    "class": "DepictionSeparatorView"
                }
            ],
            "class": "DepictionStackView"
        },
        {
            "tabname": "Link Handlers",
            "views": [
                {
                    "class": "DepictionHeaderView",
                    "title": "depiction- links."
                },
                {
                    "class": "DepictionMarkdownView",
                    "markdown": "This links to another depiction in an embed. Note that only HTTPS is supported."
                },
                {
                    "class": "DepictionButtonView",
                    "text": "View Depiction",
                    "action": "depiction-https://repo.shuga.co/depiction/native/help/heyitsshuga.lunadarkmode.json"
                }
            ],
            "class": "DepictionStackView"
        }
    ],
    "class": "DepictionTabView"
};
const nd = new Kennel(depiction);
const nd_out = nd.render();
const out = `<html lang="en">
    <head>
        <link rel="stylesheet" type="text/css" href="../dist/kennel.css">
        <title>Kennel depiction.</title>
    </head>
    <body>${nd_out}</body>
    <script>
        function changeTab(show, hide) {
            // Hide elements.
            for (let i = 0; i < document.querySelectorAll(\`\${hide}.nd_tab\`).length; i++) {
                document.querySelectorAll(\`\${hide}.nd_tab\`)[i].classList.add("hidden");
                document.querySelectorAll(\`\${hide}.nav_btn\`)[i].classList.remove("active");
            }
            // Show elements.
            for (i = 0; i < document.querySelectorAll(\`\${show}.nd_tab\`).length; i++) {
                document.querySelectorAll(\`\${show}.nd_tab\`)[i].classList.remove("hidden");
                document.querySelectorAll(\`\${show}.nav_btn\`)[i].classList.add("active");
            }
        }
</script>
</html>`;

fs.writeFile("out.html", out, (err) => {
    if (err) {
        return console.log(err);
    }
    console.log("Check out.html for demo.");
});