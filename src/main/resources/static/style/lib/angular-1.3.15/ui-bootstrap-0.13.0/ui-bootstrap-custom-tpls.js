/*
 * angular-ui-bootstrap
 * http://angular-ui.github.io/bootstrap/

 * Version: 0.13.0 - 2015-05-02
 * License: MIT
 */
angular.module("ui.bootstrap", ["ui.bootstrap.tpls","ui.bootstrap.dateparser","ui.bootstrap.datepicker","ui.bootstrap.position","ui.bootstrap.modal"]);
angular.module("ui.bootstrap.tpls", ["template/datepicker/datepicker.html","template/datepicker/day.html","template/datepicker/month.html","template/datepicker/popup.html","template/datepicker/year.html","template/modal/backdrop.html","template/modal/window.html"]);
angular.module('ui.bootstrap.dateparser', [])

.service('dateParser', ['$locale', 'orderByFilter', function($locale, orderByFilter) {
	// Pulled from https://github.com/mbostock/d3/blob/master/src/format/requote.js
	var SPECIAL_CHARACTERS_REGEXP = /[\\\^\$\*\+\?\|\[\]\(\)\.\{\}]/g;

	this.parsers = {};

	var formatCodeToRegex = {
		'yyyy': {
			regex: '\\d{4}',
			apply: function(value) { this.year = +value; }
		},
		'yy': {
			regex: '\\d{2}',
			apply: function(value) { this.year = +value + 2000; }
		},
		'y': {
			regex: '\\d{1,4}',
			apply: function(value) { this.year = +value; }
		},
		'MMMM': {
			regex: $locale.DATETIME_FORMATS.MONTH.join('|'),
			apply: function(value) { this.month = $locale.DATETIME_FORMATS.MONTH.indexOf(value); }
		},
		'MMM': {
			regex: $locale.DATETIME_FORMATS.SHORTMONTH.join('|'),
			apply: function(value) { this.month = $locale.DATETIME_FORMATS.SHORTMONTH.indexOf(value); }
		},
		'MM': {
			regex: '0[1-9]|1[0-2]',
			apply: function(value) { this.month = value - 1; }
		},
		'M': {
			regex: '[1-9]|1[0-2]',
			apply: function(value) { this.month = value - 1; }
		},
		'dd': {
			regex: '[0-2][0-9]{1}|3[0-1]{1}',
			apply: function(value) { this.date = +value; }
		},
		'd': {
			regex: '[1-2]?[0-9]{1}|3[0-1]{1}',
			apply: function(value) { this.date = +value; }
		},
		'EEEE': {
			regex: $locale.DATETIME_FORMATS.DAY.join('|')
		},
		'EEE': {
			regex: $locale.DATETIME_FORMATS.SHORTDAY.join('|')
		},
		'HH': {
			regex: '(?:0|1)[0-9]|2[0-3]',
			apply: function(value) { this.hours = +value; }
		},
		'H': {
			regex: '1?[0-9]|2[0-3]',
			apply: function(value) { this.hours = +value; }
		},
		'mm': {
			regex: '[0-5][0-9]',
			apply: function(value) { this.minutes = +value; }
		},
		'm': {
			regex: '[0-9]|[1-5][0-9]',
			apply: function(value) { this.minutes = +value; }
		},
		'sss': {
			regex: '[0-9][0-9][0-9]',
			apply: function(value) { this.milliseconds = +value; }
		},
		'ss': {
			regex: '[0-5][0-9]',
			apply: function(value) { this.seconds = +value; }
		},
		's': {
			regex: '[0-9]|[1-5][0-9]',
			apply: function(value) { this.seconds = +value; }
		}
	};

	function createParser(format) {
		var map = [], regex = format.split('');

		angular.forEach(formatCodeToRegex, function(data, code) {
			var index = format.indexOf(code);

			if (index > -1) {
				format = format.split('');

				regex[index] = '(' + data.regex + ')';
				format[index] = '$'; // Custom symbol to define consumed part of format
				for (var i = index + 1, n = index + code.length; i < n; i++) {
					regex[i] = '';
					format[i] = '$';
				}
				format = format.join('');

				map.push({ index: index, apply: data.apply });
			}
		});

		return {
			regex: new RegExp('^' + regex.join('') + '$'),
			map: orderByFilter(map, 'index')
		};
	}

	this.parse = function(input, format, baseDate) {
		if ( !angular.isString(input) || !format ) {
			return input;
		}

		format = $locale.DATETIME_FORMATS[format] || format;
		format = format.replace(SPECIAL_CHARACTERS_REGEXP, '\\$&');

		if ( !this.parsers[format] ) {
			this.parsers[format] = createParser(format);
		}

		var parser = this.parsers[format],
				regex = parser.regex,
				map = parser.map,
				results = input.match(regex);

		if ( results && results.length ) {
			var fields, dt;
			if (baseDate) {
				fields = {
					year: baseDate.getFullYear(),
					month: baseDate.getMonth(),
					date: baseDate.getDate(),
					hours: baseDate.getHours(),
					minutes: baseDate.getMinutes(),
					seconds: baseDate.getSeconds(),
					milliseconds: baseDate.getMilliseconds()
				};
			} else {
				fields = { year: 1900, month: 0, date: 1, hours: 0, minutes: 0, seconds: 0, milliseconds: 0 };
			}

			for( var i = 1, n = results.length; i < n; i++ ) {
				var mapper = map[i-1];
				if ( mapper.apply ) {
					mapper.apply.call(fields, results[i]);
				}
			}

			if ( isValid(fields.year, fields.month, fields.date) ) {
				dt = new Date(fields.year, fields.month, fields.date, fields.hours, fields.minutes, fields.seconds,
					fields.milliseconds || 0);
			}

			return dt;
		}
	};

	// Check if date is valid for specific month (and year for February).
	// Month: 0 = Jan, 1 = Feb, etc
	function isValid(year, month, date) {
		if (date < 1) {
			return false;
		}

		if ( month === 1 && date > 28) {
				return date === 29 && ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0);
		}

		if ( month === 3 || month === 5 || month === 8 || month === 10) {
				return date < 31;
		}

		return true;
	}
}]);

angular.module('ui.bootstrap.datepicker', ['ui.bootstrap.dateparser', 'ui.bootstrap.position'])

.constant('datepickerConfig', {
	formatDay: 'dd',
	formatMonth: 'MMMM',
	formatYear: 'yyyy',
	formatDayHeader: 'EEE',
	formatDayTitle: 'MMMM yyyy',
	formatMonthTitle: 'yyyy',
	datepickerMode: 'day',
	minMode: 'day',
	maxMode: 'year',
	showWeeks: true,
	startingDay: 0,
	yearRange: 20,
	minDate: null,
	maxDate: null,
	shortcutPropagation: false
})

.controller('DatepickerController', ['$scope', '$attrs', '$parse', '$interpolate', '$timeout', '$log', 'dateFilter', 'datepickerConfig', function($scope, $attrs, $parse, $interpolate, $timeout, $log, dateFilter, datepickerConfig) {
	var self = this,
			ngModelCtrl = { $setViewValue: angular.noop }; // nullModelCtrl;

	// Modes chain
	this.modes = ['day', 'month', 'year'];

	// Configuration attributes
	angular.forEach(['formatDay', 'formatMonth', 'formatYear', 'formatDayHeader', 'formatDayTitle', 'formatMonthTitle',
									 'minMode', 'maxMode', 'showWeeks', 'startingDay', 'yearRange', 'shortcutPropagation'], function( key, index ) {
		self[key] = angular.isDefined($attrs[key]) ? (index < 8 ? $interpolate($attrs[key])($scope.$parent) : $scope.$parent.$eval($attrs[key])) : datepickerConfig[key];
	});

	// Watchable date attributes
	angular.forEach(['minDate', 'maxDate'], function( key ) {
		if ( $attrs[key] ) {
			$scope.$parent.$watch($parse($attrs[key]), function(value) {
				self[key] = value ? new Date(value) : null;
				self.refreshView();
			});
		} else {
			self[key] = datepickerConfig[key] ? new Date(datepickerConfig[key]) : null;
		}
	});

	$scope.datepickerMode = $scope.datepickerMode || datepickerConfig.datepickerMode;
	$scope.maxMode = self.maxMode;
	$scope.uniqueId = 'datepicker-' + $scope.$id + '-' + Math.floor(Math.random() * 10000);

	if(angular.isDefined($attrs.initDate)) {
		this.activeDate = $scope.$parent.$eval($attrs.initDate) || new Date();
		$scope.$parent.$watch($attrs.initDate, function(initDate){
			if(initDate && (ngModelCtrl.$isEmpty(ngModelCtrl.$modelValue) || ngModelCtrl.$invalid)){
				self.activeDate = initDate;
				self.refreshView();
			}
		});
	} else {
		this.activeDate =  new Date();
	}

	$scope.isActive = function(dateObject) {
		if (self.compare(dateObject.date, self.activeDate) === 0) {
			$scope.activeDateId = dateObject.uid;
			return true;
		}
		return false;
	};

	this.init = function( ngModelCtrl_ ) {
		ngModelCtrl = ngModelCtrl_;

		ngModelCtrl.$render = function() {
			self.render();
		};
	};

	this.render = function() {
		if ( ngModelCtrl.$viewValue ) {
			var date = new Date( ngModelCtrl.$viewValue ),
					isValid = !isNaN(date);

			if ( isValid ) {
				this.activeDate = date;
			} else {
				$log.error('Datepicker directive: "ng-model" value must be a Date object, a number of milliseconds since 01.01.1970 or a string representing an RFC2822 or ISO 8601 date.');
			}
			ngModelCtrl.$setValidity('date', isValid);
		}
		this.refreshView();
	};

	this.refreshView = function() {
		if ( this.element ) {
			this._refreshView();

			var date = ngModelCtrl.$viewValue ? new Date(ngModelCtrl.$viewValue) : null;
			ngModelCtrl.$setValidity('date-disabled', !date || (this.element && !this.isDisabled(date)));
		}
	};

	this.createDateObject = function(date, format) {
		var model = ngModelCtrl.$viewValue ? new Date(ngModelCtrl.$viewValue) : null;
		return {
			date: date,
			label: dateFilter(date, format),
			selected: model && this.compare(date, model) === 0,
			disabled: this.isDisabled(date),
			current: this.compare(date, new Date()) === 0,
			customClass: this.customClass(date)
		};
	};

	this.isDisabled = function( date ) {
		return ((this.minDate && this.compare(date, this.minDate) < 0) || (this.maxDate && this.compare(date, this.maxDate) > 0) || ($attrs.dateDisabled && $scope.dateDisabled({date: date, mode: $scope.datepickerMode})));
	};

		this.customClass = function( date ) {
			return $scope.customClass({date: date, mode: $scope.datepickerMode});
		};

	// Split array into smaller arrays
	this.split = function(arr, size) {
		var arrays = [];
		while (arr.length > 0) {
			arrays.push(arr.splice(0, size));
		}
		return arrays;
	};

	$scope.select = function( date ) {
		if ( $scope.datepickerMode === self.minMode ) {
			var dt = ngModelCtrl.$viewValue ? new Date( ngModelCtrl.$viewValue ) : new Date(0, 0, 0, 0, 0, 0, 0);
			dt.setFullYear( date.getFullYear(), date.getMonth(), date.getDate() );
			ngModelCtrl.$setViewValue( dt );
			ngModelCtrl.$render();
		} else {
			self.activeDate = date;
			$scope.datepickerMode = self.modes[ self.modes.indexOf( $scope.datepickerMode ) - 1 ];
		}
	};

	$scope.move = function( direction ) {
		var year = self.activeDate.getFullYear() + direction * (self.step.years || 0),
				month = self.activeDate.getMonth() + direction * (self.step.months || 0);
		self.activeDate.setFullYear(year, month, 1);
		self.refreshView();
	};

	$scope.toggleMode = function( direction ) {
		direction = direction || 1;

		if (($scope.datepickerMode === self.maxMode && direction === 1) || ($scope.datepickerMode === self.minMode && direction === -1)) {
			return;
		}

		$scope.datepickerMode = self.modes[ self.modes.indexOf( $scope.datepickerMode ) + direction ];
	};

	// Key event mapper
	$scope.keys = { 13:'enter', 32:'space', 33:'pageup', 34:'pagedown', 35:'end', 36:'home', 37:'left', 38:'up', 39:'right', 40:'down' };

	var focusElement = function() {
		$timeout(function() {
			self.element[0].focus();
		}, 0 , false);
	};

	// Listen for focus requests from popup directive
	$scope.$on('datepicker.focus', focusElement);

	$scope.keydown = function( evt ) {
		var key = $scope.keys[evt.which];

		if ( !key || evt.shiftKey || evt.altKey ) {
			return;
		}

		evt.preventDefault();
		if(!self.shortcutPropagation){
				evt.stopPropagation();
		}

		if (key === 'enter' || key === 'space') {
			if ( self.isDisabled(self.activeDate)) {
				return; // do nothing
			}
			$scope.select(self.activeDate);
			focusElement();
		} else if (evt.ctrlKey && (key === 'up' || key === 'down')) {
			$scope.toggleMode(key === 'up' ? 1 : -1);
			focusElement();
		} else {
			self.handleKeyDown(key, evt);
			self.refreshView();
		}
	};
}])

.directive( 'datepicker', function () {
	return {
		restrict: 'EA',
		replace: true,
		templateUrl: 'template/datepicker/datepicker.html',
		scope: {
			datepickerMode: '=?',
			dateDisabled: '&',
			customClass: '&',
			shortcutPropagation: '&?'
		},
		require: ['datepicker', '?^ngModel'],
		controller: 'DatepickerController',
		link: function(scope, element, attrs, ctrls) {
			var datepickerCtrl = ctrls[0], ngModelCtrl = ctrls[1];

			if ( ngModelCtrl ) {
				datepickerCtrl.init( ngModelCtrl );
			}
		}
	};
})

.directive('daypicker', ['dateFilter', function (dateFilter) {
	return {
		restrict: 'EA',
		replace: true,
		templateUrl: 'template/datepicker/day.html',
		require: '^datepicker',
		link: function(scope, element, attrs, ctrl) {
			scope.showWeeks = ctrl.showWeeks;

			ctrl.step = { months: 1 };
			ctrl.element = element;

			var DAYS_IN_MONTH = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
			function getDaysInMonth( year, month ) {
				return ((month === 1) && (year % 4 === 0) && ((year % 100 !== 0) || (year % 400 === 0))) ? 29 : DAYS_IN_MONTH[month];
			}

			function getDates(startDate, n) {
				var dates = new Array(n), current = new Date(startDate), i = 0;
				current.setHours(12); // Prevent repeated dates because of timezone bug
				while ( i < n ) {
					dates[i++] = new Date(current);
					current.setDate( current.getDate() + 1 );
				}
				return dates;
			}

			ctrl._refreshView = function() {
				var year = ctrl.activeDate.getFullYear(),
					month = ctrl.activeDate.getMonth(),
					firstDayOfMonth = new Date(year, month, 1),
					difference = ctrl.startingDay - firstDayOfMonth.getDay(),
					numDisplayedFromPreviousMonth = (difference > 0) ? 7 - difference : - difference,
					firstDate = new Date(firstDayOfMonth);

				if ( numDisplayedFromPreviousMonth > 0 ) {
					firstDate.setDate( - numDisplayedFromPreviousMonth + 1 );
				}

				// 42 is the number of days on a six-month calendar
				var days = getDates(firstDate, 42);
				for (var i = 0; i < 42; i ++) {
					days[i] = angular.extend(ctrl.createDateObject(days[i], ctrl.formatDay), {
						secondary: days[i].getMonth() !== month,
						uid: scope.uniqueId + '-' + i
					});
				}

				scope.labels = new Array(7);
				for (var j = 0; j < 7; j++) {
					scope.labels[j] = {
						abbr: dateFilter(days[j].date, ctrl.formatDayHeader),
						full: dateFilter(days[j].date, 'EEEE')
					};
				}

				scope.title = dateFilter(ctrl.activeDate, ctrl.formatDayTitle);
				scope.rows = ctrl.split(days, 7);

				if ( scope.showWeeks ) {
					scope.weekNumbers = [];
					var thursdayIndex = (4 + 7 - ctrl.startingDay) % 7,
							numWeeks = scope.rows.length;
					for (var curWeek = 0; curWeek < numWeeks; curWeek++) {
						scope.weekNumbers.push(
							getISO8601WeekNumber( scope.rows[curWeek][thursdayIndex].date ));
					}
				}
			};

			ctrl.compare = function(date1, date2) {
				return (new Date( date1.getFullYear(), date1.getMonth(), date1.getDate() ) - new Date( date2.getFullYear(), date2.getMonth(), date2.getDate() ) );
			};

			function getISO8601WeekNumber(date) {
				var checkDate = new Date(date);
				checkDate.setDate(checkDate.getDate() + 4 - (checkDate.getDay() || 7)); // Thursday
				var time = checkDate.getTime();
				checkDate.setMonth(0); // Compare with Jan 1
				checkDate.setDate(1);
				return Math.floor(Math.round((time - checkDate) / 86400000) / 7) + 1;
			}

			ctrl.handleKeyDown = function( key, evt ) {
				var date = ctrl.activeDate.getDate();

				if (key === 'left') {
					date = date - 1;   // up
				} else if (key === 'up') {
					date = date - 7;   // down
				} else if (key === 'right') {
					date = date + 1;   // down
				} else if (key === 'down') {
					date = date + 7;
				} else if (key === 'pageup' || key === 'pagedown') {
					var month = ctrl.activeDate.getMonth() + (key === 'pageup' ? - 1 : 1);
					ctrl.activeDate.setMonth(month, 1);
					date = Math.min(getDaysInMonth(ctrl.activeDate.getFullYear(), ctrl.activeDate.getMonth()), date);
				} else if (key === 'home') {
					date = 1;
				} else if (key === 'end') {
					date = getDaysInMonth(ctrl.activeDate.getFullYear(), ctrl.activeDate.getMonth());
				}
				ctrl.activeDate.setDate(date);
			};

			ctrl.refreshView();
		}
	};
}])

.directive('monthpicker', ['dateFilter', function (dateFilter) {
	return {
		restrict: 'EA',
		replace: true,
		templateUrl: 'template/datepicker/month.html',
		require: '^datepicker',
		link: function(scope, element, attrs, ctrl) {
			ctrl.step = { years: 1 };
			ctrl.element = element;

			ctrl._refreshView = function() {
				var months = new Array(12),
						year = ctrl.activeDate.getFullYear();

				for ( var i = 0; i < 12; i++ ) {
					months[i] = angular.extend(ctrl.createDateObject(new Date(year, i, 1), ctrl.formatMonth), {
						uid: scope.uniqueId + '-' + i
					});
				}

				scope.title = dateFilter(ctrl.activeDate, ctrl.formatMonthTitle);
				scope.rows = ctrl.split(months, 3);
			};

			ctrl.compare = function(date1, date2) {
				return new Date( date1.getFullYear(), date1.getMonth() ) - new Date( date2.getFullYear(), date2.getMonth() );
			};

			ctrl.handleKeyDown = function( key, evt ) {
				var date = ctrl.activeDate.getMonth();

				if (key === 'left') {
					date = date - 1;   // up
				} else if (key === 'up') {
					date = date - 3;   // down
				} else if (key === 'right') {
					date = date + 1;   // down
				} else if (key === 'down') {
					date = date + 3;
				} else if (key === 'pageup' || key === 'pagedown') {
					var year = ctrl.activeDate.getFullYear() + (key === 'pageup' ? - 1 : 1);
					ctrl.activeDate.setFullYear(year);
				} else if (key === 'home') {
					date = 0;
				} else if (key === 'end') {
					date = 11;
				}
				ctrl.activeDate.setMonth(date);
			};

			ctrl.refreshView();
		}
	};
}])

.directive('yearpicker', ['dateFilter', function (dateFilter) {
	return {
		restrict: 'EA',
		replace: true,
		templateUrl: 'template/datepicker/year.html',
		require: '^datepicker',
		link: function(scope, element, attrs, ctrl) {
			var range = ctrl.yearRange;

			ctrl.step = { years: range };
			ctrl.element = element;

			function getStartingYear( year ) {
				return parseInt((year - 1) / range, 10) * range + 1;
			}

			ctrl._refreshView = function() {
				var years = new Array(range);

				for ( var i = 0, start = getStartingYear(ctrl.activeDate.getFullYear()); i < range; i++ ) {
					years[i] = angular.extend(ctrl.createDateObject(new Date(start + i, 0, 1), ctrl.formatYear), {
						uid: scope.uniqueId + '-' + i
					});
				}

				scope.title = [years[0].label, years[range - 1].label].join(' - ');
				scope.rows = ctrl.split(years, 5);
			};

			ctrl.compare = function(date1, date2) {
				return date1.getFullYear() - date2.getFullYear();
			};

			ctrl.handleKeyDown = function( key, evt ) {
				var date = ctrl.activeDate.getFullYear();

				if (key === 'left') {
					date = date - 1;   // up
				} else if (key === 'up') {
					date = date - 5;   // down
				} else if (key === 'right') {
					date = date + 1;   // down
				} else if (key === 'down') {
					date = date + 5;
				} else if (key === 'pageup' || key === 'pagedown') {
					date += (key === 'pageup' ? - 1 : 1) * ctrl.step.years;
				} else if (key === 'home') {
					date = getStartingYear( ctrl.activeDate.getFullYear() );
				} else if (key === 'end') {
					date = getStartingYear( ctrl.activeDate.getFullYear() ) + range - 1;
				}
				ctrl.activeDate.setFullYear(date);
			};

			ctrl.refreshView();
		}
	};
}])

.constant('datepickerPopupConfig', {
	datepickerPopup: 'yyyy-MM-dd',
	html5Types: {
		date: 'yyyy-MM-dd',
		'datetime-local': 'yyyy-MM-ddTHH:mm:ss.sss',
		'month': 'yyyy-MM'
	},
	currentText: 'Today',
	clearText: 'Clear',
	closeText: 'Done',
	closeOnDateSelection: true,
	appendToBody: false,
	showButtonBar: true
})

.directive('datepickerPopup', ['$compile', '$parse', '$document', '$position', 'dateFilter', 'dateParser', 'datepickerPopupConfig',
function ($compile, $parse, $document, $position, dateFilter, dateParser, datepickerPopupConfig) {
	return {
		restrict: 'EA',
		require: 'ngModel',
		scope: {
			isOpen: '=?',
			currentText: '@',
			clearText: '@',
			closeText: '@',
			dateDisabled: '&',
			customClass: '&'
		},
		link: function(scope, element, attrs, ngModel) {
			var dateFormat,
					closeOnDateSelection = angular.isDefined(attrs.closeOnDateSelection) ? scope.$parent.$eval(attrs.closeOnDateSelection) : datepickerPopupConfig.closeOnDateSelection,
					appendToBody = angular.isDefined(attrs.datepickerAppendToBody) ? scope.$parent.$eval(attrs.datepickerAppendToBody) : datepickerPopupConfig.appendToBody;

			scope.showButtonBar = angular.isDefined(attrs.showButtonBar) ? scope.$parent.$eval(attrs.showButtonBar) : datepickerPopupConfig.showButtonBar;

			scope.getText = function( key ) {
				return scope[key + 'Text'] || datepickerPopupConfig[key + 'Text'];
			};

			var isHtml5DateInput = false;
			if (datepickerPopupConfig.html5Types[attrs.type]) {
				dateFormat = datepickerPopupConfig.html5Types[attrs.type];
				isHtml5DateInput = true;
			} else {
				dateFormat = attrs.datepickerPopup || datepickerPopupConfig.datepickerPopup;
				attrs.$observe('datepickerPopup', function(value, oldValue) {
						var newDateFormat = value || datepickerPopupConfig.datepickerPopup;
						// Invalidate the $modelValue to ensure that formatters re-run
						// FIXME: Refactor when PR is merged: https://github.com/angular/angular.js/pull/10764
						if (newDateFormat !== dateFormat) {
							dateFormat = newDateFormat;
							ngModel.$modelValue = null;

							if (!dateFormat) {
								throw new Error('datepickerPopup must have a date format specified.');
							}
						}
				});
			}

			if (!dateFormat) {
				throw new Error('datepickerPopup must have a date format specified.');
			}

			if (isHtml5DateInput && attrs.datepickerPopup) {
				throw new Error('HTML5 date input types do not support custom formats.');
			}

			// popup element used to display calendar
			var popupEl = angular.element('<div datepicker-popup-wrap><div datepicker></div></div>');
			popupEl.attr({
				'ng-model': 'date',
				'ng-change': 'dateSelection()'
			});

			function cameltoDash( string ){
				return string.replace(/([A-Z])/g, function($1) { return '-' + $1.toLowerCase(); });
			}

			// datepicker element
			var datepickerEl = angular.element(popupEl.children()[0]);
			if (isHtml5DateInput) {
				if (attrs.type == 'month') {
					datepickerEl.attr('datepicker-mode', '"month"');
					datepickerEl.attr('min-mode', 'month');
				}
			}

			if ( attrs.datepickerOptions ) {
				var options = scope.$parent.$eval(attrs.datepickerOptions);
				if(options.initDate) {
					scope.initDate = options.initDate;
					datepickerEl.attr( 'init-date', 'initDate' );
					delete options.initDate;
				}
				angular.forEach(options, function( value, option ) {
					datepickerEl.attr( cameltoDash(option), value );
				});
			}

			scope.watchData = {};
			angular.forEach(['minDate', 'maxDate', 'datepickerMode', 'initDate', 'shortcutPropagation'], function( key ) {
				if ( attrs[key] ) {
					var getAttribute = $parse(attrs[key]);
					scope.$parent.$watch(getAttribute, function(value){
						scope.watchData[key] = value;
					});
					datepickerEl.attr(cameltoDash(key), 'watchData.' + key);

					// Propagate changes from datepicker to outside
					if ( key === 'datepickerMode' ) {
						var setAttribute = getAttribute.assign;
						scope.$watch('watchData.' + key, function(value, oldvalue) {
							if ( value !== oldvalue ) {
								setAttribute(scope.$parent, value);
							}
						});
					}
				}
			});
			if (attrs.dateDisabled) {
				datepickerEl.attr('date-disabled', 'dateDisabled({ date: date, mode: mode })');
			}

			if (attrs.showWeeks) {
				datepickerEl.attr('show-weeks', attrs.showWeeks);
			}

			if (attrs.customClass){
				datepickerEl.attr('custom-class', 'customClass({ date: date, mode: mode })');
			}

			function parseDate(viewValue) {
				if (angular.isNumber(viewValue)) {
					// presumably timestamp to date object
					viewValue = new Date(viewValue);
				}

				if (!viewValue) {
					return null;
				} else if (angular.isDate(viewValue) && !isNaN(viewValue)) {
					return viewValue;
				} else if (angular.isString(viewValue)) {
					var date = dateParser.parse(viewValue, dateFormat, scope.date) || new Date(viewValue);
					if (isNaN(date)) {
						return undefined;
					} else {
						return date;
					}
				} else {
					return undefined;
				}
			}

			function validator(modelValue, viewValue) {
				var value = modelValue || viewValue;
				if (angular.isNumber(value)) {
					value = new Date(value);
				}
				if (!value) {
					return true;
				} else if (angular.isDate(value) && !isNaN(value)) {
					return true;
				} else if (angular.isString(value)) {
					var date = dateParser.parse(value, dateFormat) || new Date(value);
					return !isNaN(date);
				} else {
					return false;
				}
			}

			if (!isHtml5DateInput) {
				// Internal API to maintain the correct ng-invalid-[key] class
				ngModel.$$parserName = 'date';
				ngModel.$validators.date = validator;
				ngModel.$parsers.unshift(parseDate);
				ngModel.$formatters.push(function (value) {
					scope.date = value;
					return ngModel.$isEmpty(value) ? value : dateFilter(value, dateFormat);
				});
			}
			else {
				ngModel.$formatters.push(function (value) {
					scope.date = value;
					return value;
				});
			}

			// Inner change
			scope.dateSelection = function(dt) {
				if (angular.isDefined(dt)) {
					scope.date = dt;
				}
				var date = scope.date ? dateFilter(scope.date, dateFormat) : '';
				element.val(date);
				ngModel.$setViewValue(date);

				if ( closeOnDateSelection ) {
					scope.isOpen = false;
					element[0].focus();
				}
			};

			// Detect changes in the view from the text box
			ngModel.$viewChangeListeners.push(function () {
				scope.date = dateParser.parse(ngModel.$viewValue, dateFormat, scope.date) || new Date(ngModel.$viewValue);
			});

			var documentClickBind = function(event) {
				if (scope.isOpen && event.target !== element[0]) {
					scope.$apply(function() {
						scope.isOpen = false;
					});
				}
			};

			var keydown = function(evt, noApply) {
				scope.keydown(evt);
			};
			element.bind('keydown', keydown);

			scope.keydown = function(evt) {
				if (evt.which === 27) {
					evt.preventDefault();
					if (scope.isOpen) {
						evt.stopPropagation();
					}
					scope.close();
				} else if (evt.which === 40 && !scope.isOpen) {
					scope.isOpen = true;
				}
			};

			scope.$watch('isOpen', function(value) {
				if (value) {
					scope.$broadcast('datepicker.focus');
					scope.position = appendToBody ? $position.offset(element) : $position.position(element);
					scope.position.top = scope.position.top + element.prop('offsetHeight');

					$document.bind('click', documentClickBind);
				} else {
					$document.unbind('click', documentClickBind);
				}
			});

			scope.select = function( date ) {
				if (date === 'today') {
					var today = new Date();
					if (angular.isDate(scope.date)) {
						date = new Date(scope.date);
						date.setFullYear(today.getFullYear(), today.getMonth(), today.getDate());
					} else {
						date = new Date(today.setHours(0, 0, 0, 0));
					}
				}
				scope.dateSelection( date );
			};

			scope.close = function() {
				scope.isOpen = false;
				element[0].focus();
			};

			var $popup = $compile(popupEl)(scope);
			// Prevent jQuery cache memory leak (template is now redundant after linking)
			popupEl.remove();

			if ( appendToBody ) {
				$document.find('body').append($popup);
			} else {
				element.after($popup);
			}

			scope.$on('$destroy', function() {
				$popup.remove();
				element.unbind('keydown', keydown);
				$document.unbind('click', documentClickBind);
			});
		}
	};
}])

.directive('datepickerPopupWrap', function() {
	return {
		restrict:'EA',
		replace: true,
		transclude: true,
		templateUrl: 'template/datepicker/popup.html',
		link:function (scope, element, attrs) {
			element.bind('click', function(event) {
				event.preventDefault();
				event.stopPropagation();
			});
		}
	};
});

angular.module('ui.bootstrap.position', [])

/**
 * A set of utility methods that can be use to retrieve position of DOM elements.
 * It is meant to be used where we need to absolute-position DOM elements in
 * relation to other, existing elements (this is the case for tooltips, popovers,
 * typeahead suggestions etc.).
 */
	.factory('$position', ['$document', '$window', function ($document, $window) {

		function getStyle(el, cssprop) {
			if (el.currentStyle) { //IE
				return el.currentStyle[cssprop];
			} else if ($window.getComputedStyle) {
				return $window.getComputedStyle(el)[cssprop];
			}
			// finally try and get inline style
			return el.style[cssprop];
		}

		/**
		 * Checks if a given element is statically positioned
		 * @param element - raw DOM element
		 */
		function isStaticPositioned(element) {
			return (getStyle(element, 'position') || 'static' ) === 'static';
		}

		/**
		 * returns the closest, non-statically positioned parentOffset of a given element
		 * @param element
		 */
		var parentOffsetEl = function (element) {
			var docDomEl = $document[0];
			var offsetParent = element.offsetParent || docDomEl;
			while (offsetParent && offsetParent !== docDomEl && isStaticPositioned(offsetParent) ) {
				offsetParent = offsetParent.offsetParent;
			}
			return offsetParent || docDomEl;
		};

		return {
			/**
			 * Provides read-only equivalent of jQuery's position function:
			 * http://api.jquery.com/position/
			 */
			position: function (element) {
				var elBCR = this.offset(element);
				var offsetParentBCR = { top: 0, left: 0 };
				var offsetParentEl = parentOffsetEl(element[0]);
				if (offsetParentEl != $document[0]) {
					offsetParentBCR = this.offset(angular.element(offsetParentEl));
					offsetParentBCR.top += offsetParentEl.clientTop - offsetParentEl.scrollTop;
					offsetParentBCR.left += offsetParentEl.clientLeft - offsetParentEl.scrollLeft;
				}

				var boundingClientRect = element[0].getBoundingClientRect();
				return {
					width: boundingClientRect.width || element.prop('offsetWidth'),
					height: boundingClientRect.height || element.prop('offsetHeight'),
					top: elBCR.top - offsetParentBCR.top,
					left: elBCR.left - offsetParentBCR.left
				};
			},

			/**
			 * Provides read-only equivalent of jQuery's offset function:
			 * http://api.jquery.com/offset/
			 */
			offset: function (element) {
				var boundingClientRect = element[0].getBoundingClientRect();
				return {
					width: boundingClientRect.width || element.prop('offsetWidth'),
					height: boundingClientRect.height || element.prop('offsetHeight'),
					top: boundingClientRect.top + ($window.pageYOffset || $document[0].documentElement.scrollTop),
					left: boundingClientRect.left + ($window.pageXOffset || $document[0].documentElement.scrollLeft)
				};
			},

			/**
			 * Provides coordinates for the targetEl in relation to hostEl
			 */
			positionElements: function (hostEl, targetEl, positionStr, appendToBody) {

				var positionStrParts = positionStr.split('-');
				var pos0 = positionStrParts[0], pos1 = positionStrParts[1] || 'center';

				var hostElPos,
					targetElWidth,
					targetElHeight,
					targetElPos;

				hostElPos = appendToBody ? this.offset(hostEl) : this.position(hostEl);

				targetElWidth = targetEl.prop('offsetWidth');
				targetElHeight = targetEl.prop('offsetHeight');

				var shiftWidth = {
					center: function () {
						return hostElPos.left + hostElPos.width / 2 - targetElWidth / 2;
					},
					left: function () {
						return hostElPos.left;
					},
					right: function () {
						return hostElPos.left + hostElPos.width;
					}
				};

				var shiftHeight = {
					center: function () {
						return hostElPos.top + hostElPos.height / 2 - targetElHeight / 2;
					},
					top: function () {
						return hostElPos.top;
					},
					bottom: function () {
						return hostElPos.top + hostElPos.height;
					}
				};

				switch (pos0) {
					case 'right':
						targetElPos = {
							top: shiftHeight[pos1](),
							left: shiftWidth[pos0]()
						};
						break;
					case 'left':
						targetElPos = {
							top: shiftHeight[pos1](),
							left: hostElPos.left - targetElWidth
						};
						break;
					case 'bottom':
						targetElPos = {
							top: shiftHeight[pos0](),
							left: shiftWidth[pos1]()
						};
						break;
					default:
						targetElPos = {
							top: hostElPos.top - targetElHeight,
							left: shiftWidth[pos1]()
						};
						break;
				}

				return targetElPos;
			}
		};
	}]);

angular.module('ui.bootstrap.modal', [])

/**
 * A helper, internal data structure that acts as a map but also allows getting / removing
 * elements in the LIFO order
 */
	.factory('$$stackedMap', function () {
		return {
			createNew: function () {
				var stack = [];

				return {
					add: function (key, value) {
						stack.push({
							key: key,
							value: value
						});
					},
					get: function (key) {
						for (var i = 0; i < stack.length; i++) {
							if (key == stack[i].key) {
								return stack[i];
							}
						}
					},
					keys: function() {
						var keys = [];
						for (var i = 0; i < stack.length; i++) {
							keys.push(stack[i].key);
						}
						return keys;
					},
					top: function () {
						return stack[stack.length - 1];
					},
					remove: function (key) {
						var idx = -1;
						for (var i = 0; i < stack.length; i++) {
							if (key == stack[i].key) {
								idx = i;
								break;
							}
						}
						return stack.splice(idx, 1)[0];
					},
					removeTop: function () {
						return stack.splice(stack.length - 1, 1)[0];
					},
					length: function () {
						return stack.length;
					}
				};
			}
		};
	})

/**
 * A helper directive for the $modal service. It creates a backdrop element.
 */
	.directive('modalBackdrop', ['$timeout', function ($timeout) {
		return {
			restrict: 'EA',
			replace: true,
			templateUrl: 'template/modal/backdrop.html',
			compile: function (tElement, tAttrs) {
				tElement.addClass(tAttrs.backdropClass);
				return linkFn;
			}
		};

		function linkFn(scope, element, attrs) {
			scope.animate = false;

			//trigger CSS transitions
			$timeout(function () {
				scope.animate = true;
			});
		}
	}])

	.directive('modalWindow', ['$modalStack', '$q', function ($modalStack, $q) {
		return {
			restrict: 'EA',
			scope: {
				index: '@',
				animate: '='
			},
			replace: true,
			transclude: true,
			templateUrl: function(tElement, tAttrs) {
				return tAttrs.templateUrl || 'template/modal/window.html';
			},
			link: function (scope, element, attrs) {
				element.addClass(attrs.windowClass || '');
				scope.size = attrs.size;

				scope.close = function (evt) {
					var modal = $modalStack.getTop();
					if (modal && modal.value.backdrop && modal.value.backdrop != 'static' && (evt.target === evt.currentTarget)) {
						evt.preventDefault();
						evt.stopPropagation();
						$modalStack.dismiss(modal.key, 'backdrop click');
					}
				};

				// This property is only added to the scope for the purpose of detecting when this directive is rendered.
				// We can detect that by using this property in the template associated with this directive and then use
				// {@link Attribute#$observe} on it. For more details please see {@link TableColumnResize}.
				scope.$isRendered = true;

				// Deferred object that will be resolved when this modal is render.
				var modalRenderDeferObj = $q.defer();
				// Observe function will be called on next digest cycle after compilation, ensuring that the DOM is ready.
				// In order to use this way of finding whether DOM is ready, we need to observe a scope property used in modal's template.
				attrs.$observe('modalRender', function (value) {
					if (value == 'true') {
						modalRenderDeferObj.resolve();
					}
				});

				modalRenderDeferObj.promise.then(function () {
					// trigger CSS transitions
					scope.animate = true;

					var inputsWithAutofocus = element[0].querySelectorAll('[autofocus]');
					/**
					 * Auto-focusing of a freshly-opened modal element causes any child elements
					 * with the autofocus attribute to lose focus. This is an issue on touch
					 * based devices which will show and then hide the onscreen keyboard.
					 * Attempts to refocus the autofocus element via JavaScript will not reopen
					 * the onscreen keyboard. Fixed by updated the focusing logic to only autofocus
					 * the modal element if the modal does not contain an autofocus element.
					 */
					if (inputsWithAutofocus.length) {
						inputsWithAutofocus[0].focus();
					} else {
						element[0].focus();
					}

					// Notify {@link $modalStack} that modal is rendered.
					var modal = $modalStack.getTop();
					if (modal) {
						$modalStack.modalRendered(modal.key);
					}
				});
			}
		};
	}])

	.directive('modalAnimationClass', [
		function () {
			return {
				compile: function (tElement, tAttrs) {
					if (tAttrs.modalAnimation) {
						tElement.addClass(tAttrs.modalAnimationClass);
					}
				}
			};
		}])

	.directive('modalTransclude', function () {
		return {
			link: function($scope, $element, $attrs, controller, $transclude) {
				$transclude($scope.$parent, function(clone) {
					$element.empty();
					$element.append(clone);
				});
			}
		};
	})

	.factory('$modalStack', ['$animate', '$timeout', '$document', '$compile', '$rootScope', '$$stackedMap',
		function ($animate, $timeout, $document, $compile, $rootScope, $$stackedMap) {

			var OPENED_MODAL_CLASS = 'modal-open';

			var backdropDomEl, backdropScope;
			var openedWindows = $$stackedMap.createNew();
			var $modalStack = {};

			function backdropIndex() {
				var topBackdropIndex = -1;
				var opened = openedWindows.keys();
				for (var i = 0; i < opened.length; i++) {
					if (openedWindows.get(opened[i]).value.backdrop) {
						topBackdropIndex = i;
					}
				}
				return topBackdropIndex;
			}

			$rootScope.$watch(backdropIndex, function(newBackdropIndex){
				if (backdropScope) {
					backdropScope.index = newBackdropIndex;
				}
			});

			function removeModalWindow(modalInstance) {

				var body = $document.find('body').eq(0);
				var modalWindow = openedWindows.get(modalInstance).value;

				//clean up the stack
				openedWindows.remove(modalInstance);

				//remove window DOM element
				removeAfterAnimate(modalWindow.modalDomEl, modalWindow.modalScope, function() {
					body.toggleClass(OPENED_MODAL_CLASS, openedWindows.length() > 0);
					checkRemoveBackdrop();
				});
			}

			function checkRemoveBackdrop() {
					//remove backdrop if no longer needed
					if (backdropDomEl && backdropIndex() == -1) {
						var backdropScopeRef = backdropScope;
						removeAfterAnimate(backdropDomEl, backdropScope, function () {
							backdropScopeRef = null;
						});
						backdropDomEl = undefined;
						backdropScope = undefined;
					}
			}

			function removeAfterAnimate(domEl, scope, done) {
				// Closing animation
				scope.animate = false;

				if (domEl.attr('modal-animation') && $animate.enabled()) {
					// transition out
					domEl.one('$animate:close', function closeFn() {
						$rootScope.$evalAsync(afterAnimating);
					});
				} else {
					// Ensure this call is async
					$timeout(afterAnimating);
				}

				function afterAnimating() {
					if (afterAnimating.done) {
						return;
					}
					afterAnimating.done = true;

					domEl.remove();
					scope.$destroy();
					if (done) {
						done();
					}
				}
			}

			$document.bind('keydown', function (evt) {
				var modal;

				if (evt.which === 27) {
					modal = openedWindows.top();
					if (modal && modal.value.keyboard) {
						evt.preventDefault();
						$rootScope.$apply(function () {
							$modalStack.dismiss(modal.key, 'escape key press');
						});
					}
				}
			});

			$modalStack.open = function (modalInstance, modal) {

				var modalOpener = $document[0].activeElement;

				openedWindows.add(modalInstance, {
					deferred: modal.deferred,
					renderDeferred: modal.renderDeferred,
					modalScope: modal.scope,
					backdrop: modal.backdrop,
					keyboard: modal.keyboard
				});

				var body = $document.find('body').eq(0),
						currBackdropIndex = backdropIndex();

				if (currBackdropIndex >= 0 && !backdropDomEl) {
					backdropScope = $rootScope.$new(true);
					backdropScope.index = currBackdropIndex;
					var angularBackgroundDomEl = angular.element('<div modal-backdrop="modal-backdrop"></div>');
					angularBackgroundDomEl.attr('backdrop-class', modal.backdropClass);
					if (modal.animation) {
						angularBackgroundDomEl.attr('modal-animation', 'true');
					}
					backdropDomEl = $compile(angularBackgroundDomEl)(backdropScope);
					body.append(backdropDomEl);
				}

				var angularDomEl = angular.element('<div modal-window="modal-window"></div>');
				angularDomEl.attr({
					'template-url': modal.windowTemplateUrl,
					'window-class': modal.windowClass,
					'size': modal.size,
					'index': openedWindows.length() - 1,
					'animate': 'animate'
				}).html(modal.content);
				if (modal.animation) {
					angularDomEl.attr('modal-animation', 'true');
				}

				var modalDomEl = $compile(angularDomEl)(modal.scope);
				openedWindows.top().value.modalDomEl = modalDomEl;
				openedWindows.top().value.modalOpener = modalOpener;
				body.append(modalDomEl);
				body.addClass(OPENED_MODAL_CLASS);
			};

			function broadcastClosing(modalWindow, resultOrReason, closing) {
					return !modalWindow.value.modalScope.$broadcast('modal.closing', resultOrReason, closing).defaultPrevented;
			}

			$modalStack.close = function (modalInstance, result) {
				var modalWindow = openedWindows.get(modalInstance);
				if (modalWindow && broadcastClosing(modalWindow, result, true)) {
					modalWindow.value.deferred.resolve(result);
					removeModalWindow(modalInstance);
					modalWindow.value.modalOpener.focus();
					return true;
				}
				return !modalWindow;
			};

			$modalStack.dismiss = function (modalInstance, reason) {
				var modalWindow = openedWindows.get(modalInstance);
				if (modalWindow && broadcastClosing(modalWindow, reason, false)) {
					modalWindow.value.deferred.reject(reason);
					removeModalWindow(modalInstance);
					modalWindow.value.modalOpener.focus();
					return true;
				}
				return !modalWindow;
			};

			$modalStack.dismissAll = function (reason) {
				var topModal = this.getTop();
				while (topModal && this.dismiss(topModal.key, reason)) {
					topModal = this.getTop();
				}
			};

			$modalStack.getTop = function () {
				return openedWindows.top();
			};

			$modalStack.modalRendered = function (modalInstance) {
				var modalWindow = openedWindows.get(modalInstance);
				if (modalWindow) {
					modalWindow.value.renderDeferred.resolve();
				}
			};

			return $modalStack;
		}])

	.provider('$modal', function () {

		var $modalProvider = {
			options: {
				animation: true,
				backdrop: true, //can also be false or 'static'
				keyboard: true
			},
			$get: ['$injector', '$rootScope', '$q', '$templateRequest', '$controller', '$modalStack',
				function ($injector, $rootScope, $q, $templateRequest, $controller, $modalStack) {

					var $modal = {};

					function getTemplatePromise(options) {
						return options.template ? $q.when(options.template) :
							$templateRequest(angular.isFunction(options.templateUrl) ? (options.templateUrl)() : options.templateUrl);
					}

					function getResolvePromises(resolves) {
						var promisesArr = [];
						angular.forEach(resolves, function (value) {
							if (angular.isFunction(value) || angular.isArray(value)) {
								promisesArr.push($q.when($injector.invoke(value)));
							}
						});
						return promisesArr;
					}

					$modal.open = function (modalOptions) {

						var modalResultDeferred = $q.defer();
						var modalOpenedDeferred = $q.defer();
						var modalRenderDeferred = $q.defer();

						//prepare an instance of a modal to be injected into controllers and returned to a caller
						var modalInstance = {
							result: modalResultDeferred.promise,
							opened: modalOpenedDeferred.promise,
							rendered: modalRenderDeferred.promise,
							close: function (result) {
								return $modalStack.close(modalInstance, result);
							},
							dismiss: function (reason) {
								return $modalStack.dismiss(modalInstance, reason);
							}
						};

						//merge and clean up options
						modalOptions = angular.extend({}, $modalProvider.options, modalOptions);
						modalOptions.resolve = modalOptions.resolve || {};

						//verify options
						if (!modalOptions.template && !modalOptions.templateUrl) {
							throw new Error('One of template or templateUrl options is required.');
						}

						var templateAndResolvePromise =
							$q.all([getTemplatePromise(modalOptions)].concat(getResolvePromises(modalOptions.resolve)));


						templateAndResolvePromise.then(function resolveSuccess(tplAndVars) {

							var modalScope = (modalOptions.scope || $rootScope).$new();
							modalScope.$close = modalInstance.close;
							modalScope.$dismiss = modalInstance.dismiss;

							var ctrlInstance, ctrlLocals = {};
							var resolveIter = 1;

							//controllers
							if (modalOptions.controller) {
								ctrlLocals.$scope = modalScope;
								ctrlLocals.$modalInstance = modalInstance;
								angular.forEach(modalOptions.resolve, function (value, key) {
									ctrlLocals[key] = tplAndVars[resolveIter++];
								});

								ctrlInstance = $controller(modalOptions.controller, ctrlLocals);
								if (modalOptions.controllerAs) {
									modalScope[modalOptions.controllerAs] = ctrlInstance;
								}
							}

							$modalStack.open(modalInstance, {
								scope: modalScope,
								deferred: modalResultDeferred,
								renderDeferred: modalRenderDeferred,
								content: tplAndVars[0],
								animation: modalOptions.animation,
								backdrop: modalOptions.backdrop,
								keyboard: modalOptions.keyboard,
								backdropClass: modalOptions.backdropClass,
								windowClass: modalOptions.windowClass,
								windowTemplateUrl: modalOptions.windowTemplateUrl,
								size: modalOptions.size
							});

						}, function resolveError(reason) {
							modalResultDeferred.reject(reason);
						});

						templateAndResolvePromise.then(function () {
							modalOpenedDeferred.resolve(true);
						}, function (reason) {
							modalOpenedDeferred.reject(reason);
						});

						return modalInstance;
					};

					return $modal;
				}]
		};

		return $modalProvider;
	});

angular.module("template/datepicker/datepicker.html", []).run(["$templateCache", function($templateCache) {
	$templateCache.put("template/datepicker/datepicker.html",
		"<div ng-switch=\"datepickerMode\" role=\"application\" ng-keydown=\"keydown($event)\">\n" +
		"  <daypicker ng-switch-when=\"day\" tabindex=\"0\"></daypicker>\n" +
		"  <monthpicker ng-switch-when=\"month\" tabindex=\"0\"></monthpicker>\n" +
		"  <yearpicker ng-switch-when=\"year\" tabindex=\"0\"></yearpicker>\n" +
		"</div>");
}]);

angular.module("template/datepicker/day.html", []).run(["$templateCache", function($templateCache) {
	$templateCache.put("template/datepicker/day.html",
		"<table role=\"grid\" aria-labelledby=\"{{uniqueId}}-title\" aria-activedescendant=\"{{activeDateId}}\">\n" +
		"  <thead>\n" +
		"    <tr>\n" +
		"      <th><button type=\"button\" class=\"btn btn-default btn-sm pull-left\" ng-click=\"move(-1)\" tabindex=\"-1\"><i class=\"glyphicon glyphicon-chevron-left\"></i></button></th>\n" +
		"      <th colspan=\"{{5 + showWeeks}}\"><button id=\"{{uniqueId}}-title\" role=\"heading\" aria-live=\"assertive\" aria-atomic=\"true\" type=\"button\" class=\"btn btn-default btn-sm\" ng-click=\"toggleMode()\" ng-disabled=\"datepickerMode === maxMode\" tabindex=\"-1\" style=\"width:100%;\"><strong>{{title}}</strong></button></th>\n" +
		"      <th><button type=\"button\" class=\"btn btn-default btn-sm pull-right\" ng-click=\"move(1)\" tabindex=\"-1\"><i class=\"glyphicon glyphicon-chevron-right\"></i></button></th>\n" +
		"    </tr>\n" +
		"    <tr>\n" +
		"      <th ng-show=\"showWeeks\" class=\"text-center\"></th>\n" +
		"      <th ng-repeat=\"label in labels track by $index\" class=\"text-center\"><small aria-label=\"{{label.full}}\">{{label.abbr}}</small></th>\n" +
		"    </tr>\n" +
		"  </thead>\n" +
		"  <tbody>\n" +
		"    <tr ng-repeat=\"row in rows track by $index\">\n" +
		"      <td ng-show=\"showWeeks\" class=\"text-center h6\"><em>{{ weekNumbers[$index] }}</em></td>\n" +
		"      <td ng-repeat=\"dt in row track by dt.date\" class=\"text-center\" role=\"gridcell\" id=\"{{dt.uid}}\" aria-disabled=\"{{!!dt.disabled}}\" ng-class=\"dt.customClass\">\n" +
		"        <button type=\"button\" style=\"width:100%;\" class=\"btn btn-default btn-sm\" ng-class=\"{'btn-info': dt.selected, active: isActive(dt)}\" ng-click=\"select(dt.date)\" ng-disabled=\"dt.disabled\" tabindex=\"-1\"><span ng-class=\"{'text-muted': dt.secondary, 'text-info': dt.current}\">{{dt.label}}</span></button>\n" +
		"      </td>\n" +
		"    </tr>\n" +
		"  </tbody>\n" +
		"</table>\n" +
		"");
}]);

angular.module("template/datepicker/month.html", []).run(["$templateCache", function($templateCache) {
	$templateCache.put("template/datepicker/month.html",
		"<table role=\"grid\" aria-labelledby=\"{{uniqueId}}-title\" aria-activedescendant=\"{{activeDateId}}\">\n" +
		"  <thead>\n" +
		"    <tr>\n" +
		"      <th><button type=\"button\" class=\"btn btn-default btn-sm pull-left\" ng-click=\"move(-1)\" tabindex=\"-1\"><i class=\"glyphicon glyphicon-chevron-left\"></i></button></th>\n" +
		"      <th><button id=\"{{uniqueId}}-title\" role=\"heading\" aria-live=\"assertive\" aria-atomic=\"true\" type=\"button\" class=\"btn btn-default btn-sm\" ng-click=\"toggleMode()\" ng-disabled=\"datepickerMode === maxMode\" tabindex=\"-1\" style=\"width:100%;\"><strong>{{title}}</strong></button></th>\n" +
		"      <th><button type=\"button\" class=\"btn btn-default btn-sm pull-right\" ng-click=\"move(1)\" tabindex=\"-1\"><i class=\"glyphicon glyphicon-chevron-right\"></i></button></th>\n" +
		"    </tr>\n" +
		"  </thead>\n" +
		"  <tbody>\n" +
		"    <tr ng-repeat=\"row in rows track by $index\">\n" +
		"      <td ng-repeat=\"dt in row track by dt.date\" class=\"text-center\" role=\"gridcell\" id=\"{{dt.uid}}\" aria-disabled=\"{{!!dt.disabled}}\">\n" +
		"        <button type=\"button\" style=\"width:100%;\" class=\"btn btn-default\" ng-class=\"{'btn-info': dt.selected, active: isActive(dt)}\" ng-click=\"select(dt.date)\" ng-disabled=\"dt.disabled\" tabindex=\"-1\"><span ng-class=\"{'text-info': dt.current}\">{{dt.label}}</span></button>\n" +
		"      </td>\n" +
		"    </tr>\n" +
		"  </tbody>\n" +
		"</table>\n" +
		"");
}]);

angular.module("template/datepicker/popup.html", []).run(["$templateCache", function($templateCache) {
	$templateCache.put("template/datepicker/popup.html",
		"<ul class=\"dropdown-menu\" ng-style=\"{display: (isOpen && 'block') || 'none', top: position.top+'px', left: position.left+'px'}\" ng-keydown=\"keydown($event)\">\n" +
		"	<li ng-transclude></li>\n" +
		"	<li ng-if=\"showButtonBar\" style=\"padding:10px 9px 2px\">\n" +
		"		<span class=\"btn-group pull-left\">\n" +
		"			<button type=\"button\" class=\"btn btn-sm btn-info\" ng-click=\"select('today')\">{{ getText('current') }}</button>\n" +
		"			<button type=\"button\" class=\"btn btn-sm btn-danger\" ng-click=\"select(null)\">{{ getText('clear') }}</button>\n" +
		"		</span>\n" +
		"		<button type=\"button\" class=\"btn btn-sm btn-success pull-right\" ng-click=\"close()\">{{ getText('close') }}</button>\n" +
		"	</li>\n" +
		"</ul>\n" +
		"");
}]);

angular.module("template/datepicker/year.html", []).run(["$templateCache", function($templateCache) {
	$templateCache.put("template/datepicker/year.html",
		"<table role=\"grid\" aria-labelledby=\"{{uniqueId}}-title\" aria-activedescendant=\"{{activeDateId}}\">\n" +
		"  <thead>\n" +
		"    <tr>\n" +
		"      <th><button type=\"button\" class=\"btn btn-default btn-sm pull-left\" ng-click=\"move(-1)\" tabindex=\"-1\"><i class=\"glyphicon glyphicon-chevron-left\"></i></button></th>\n" +
		"      <th colspan=\"3\"><button id=\"{{uniqueId}}-title\" role=\"heading\" aria-live=\"assertive\" aria-atomic=\"true\" type=\"button\" class=\"btn btn-default btn-sm\" ng-click=\"toggleMode()\" ng-disabled=\"datepickerMode === maxMode\" tabindex=\"-1\" style=\"width:100%;\"><strong>{{title}}</strong></button></th>\n" +
		"      <th><button type=\"button\" class=\"btn btn-default btn-sm pull-right\" ng-click=\"move(1)\" tabindex=\"-1\"><i class=\"glyphicon glyphicon-chevron-right\"></i></button></th>\n" +
		"    </tr>\n" +
		"  </thead>\n" +
		"  <tbody>\n" +
		"    <tr ng-repeat=\"row in rows track by $index\">\n" +
		"      <td ng-repeat=\"dt in row track by dt.date\" class=\"text-center\" role=\"gridcell\" id=\"{{dt.uid}}\" aria-disabled=\"{{!!dt.disabled}}\">\n" +
		"        <button type=\"button\" style=\"width:100%;\" class=\"btn btn-default\" ng-class=\"{'btn-info': dt.selected, active: isActive(dt)}\" ng-click=\"select(dt.date)\" ng-disabled=\"dt.disabled\" tabindex=\"-1\"><span ng-class=\"{'text-info': dt.current}\">{{dt.label}}</span></button>\n" +
		"      </td>\n" +
		"    </tr>\n" +
		"  </tbody>\n" +
		"</table>\n" +
		"");
}]);

angular.module("template/modal/backdrop.html", []).run(["$templateCache", function($templateCache) {
	$templateCache.put("template/modal/backdrop.html",
		"<div class=\"modal-backdrop\"\n" +
		"     modal-animation-class=\"fade\"\n" +
		"     ng-class=\"{in: animate}\"\n" +
		"     ng-style=\"{'z-index': 1040 + (index && 1 || 0) + index*10}\"\n" +
		"></div>\n" +
		"");
}]);

angular.module("template/modal/window.html", []).run(["$templateCache", function($templateCache) {
	$templateCache.put("template/modal/window.html",
		"<div modal-render=\"{{$isRendered}}\" tabindex=\"-1\" role=\"dialog\" class=\"modal\"\n" +
		"    modal-animation-class=\"fade\"\n" +
		"	ng-class=\"{in: animate}\" ng-style=\"{'z-index': 1050 + index*10, display: 'block'}\" ng-click=\"close($event)\">\n" +
		"    <div class=\"modal-dialog\" ng-class=\"size ? 'modal-' + size : ''\"><div class=\"modal-content\" modal-transclude></div></div>\n" +
		"</div>\n" +
		"");
}]);
