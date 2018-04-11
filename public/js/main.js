$(document).ready(function() {
  valueChanged()
})

function valueChanged() {
  if ($('#include').is(':checked')) $('#maxDistanceDiv').show(300)
  else $('#maxDistanceDiv').hide(200)
}
