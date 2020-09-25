describe('stringFormat', function() {

  beforeEach(module('core'));

  it('should format Strings: e.g. \'divided-word\' to \'Divided Word\' ',
    inject(function(stringFormatFilter) {
      expect(stringFormatFilter('divided-word')).toBe('Divided Word');
      expect(stringFormatFilter('Tree')).toBe('Tree');
    })
  );

});