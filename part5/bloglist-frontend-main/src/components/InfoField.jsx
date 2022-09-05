import PropTypes from 'prop-types';

function InfoField({ text, isError }) {
  const infoStyle = {
    borderStyle: 'solid',
    padding: '5px',
  };

  if (isError) {
    infoStyle.color = 'red';
  }

  if (!text) {
    return null;
  }
  return (
    <h1 style={infoStyle}>
      { text }
    </h1>
  );
}
InfoField.propTypes = {
  text: PropTypes.string.isRequired,
  isError: PropTypes.bool,
};
InfoField.defaultProps = {
  isError: false,
};

export default InfoField;
