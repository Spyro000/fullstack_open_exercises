import PropTypes from 'prop-types';
import { useState, forwardRef, useImperativeHandle } from 'react';

const Toggable = forwardRef(({ buttonName, children }, refs) => {
  const [isHidden, setIsHidden] = useState(true);
  const hideWhenVisible = { display: isHidden ? '' : 'none' };
  const showWhenVisible = { display: isHidden ? 'none' : '' };
  const toggleVisibility = () => setIsHidden(!isHidden);

  useImperativeHandle(refs, () => ({ toggleVisibility }));

  return (
    <div>
      <div style={hideWhenVisible}>
        <button type="button" onClick={toggleVisibility}>{buttonName}</button>
      </div>
      <div style={showWhenVisible}>
        {children}
        <button type="button" onClick={toggleVisibility}>cancel</button>
      </div>
    </div>
  );
});

Toggable.propTypes = {
  buttonName: PropTypes.string.isRequired,
  children: PropTypes.arrayOf(PropTypes.element).isRequired,
};

export default Toggable;
