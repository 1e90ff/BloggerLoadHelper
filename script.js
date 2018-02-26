/*
 * BloggerLoadHelper, a JavaScript plug-in for Blogger blogs
 * Copyright (C) 2018 Ulises López
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 */

(function () {
	"use strict";

	var _data  = {},
	    _stack = [];

	function _eval(expr, fn, mobile) {
		var cond   = (expr === "*"),
		    params = expr.split("|");

		if (!cond) {
			params.forEach(function (param) {
				cond = cond || _data.view[param];
			});
		}

		if (cond && (mobile || mobile === undefined || !_data.blog.is_mobile)) {
			fn();
		}
	}

	window.BloggerLoadHelper = function () {
		return {
			isView: function (expr, fn, mobile) {
				if (document.readyState === "complete") {
					_eval(expr, fn, mobile);
				} else {
					_stack.push({
						expr: expr, fn: fn, mobile: mobile
					});
				}
			}
		};
	};

	window.addEventListener("load", function () {
		var data = this._WidgetManager._GetAllData();

		_data = {
			view: {
				item:      data.view.isSingleItem,
				post:      data.view.isPost,
				page:      data.view.isPage,
				feed:      data.view.isMultipleItems,
				home:      data.view.isHomepage,
				query:     data.view.isSearch && data.view.search.query,
				label:     data.view.isLabelSearch,
				error:     data.view.isError,
				search:    data.view.isSearch,
				archive:   data.view.isArchive
			},
			blog: {
				is_mobile: data.blog.isMobileRequest
			}
		};

		_stack.forEach(function (item) {
			_eval(item.expr, item.fn, item.mobile);
		});
	});
}());