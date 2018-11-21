$(".radio-btn").on('click', function() {
	var _this = $(this),
		block = _this.parent().parent();
	block.find('input:radio').attr('checked', false);
	block.find(".radio-btn").removeClass('checkedRadio');
	_this.addClass('checkedRadio');
	_this.find('input:radio').attr('checked', true);
});

$.fn.toggleCheckbox = function() {
	this.attr('checked', !this.attr('checked'));
}
$('.check-box').on('click', function() {
	$(this).find(':checkbox').toggleCheckbox();
	$(this).toggleClass('checkedBox');
});