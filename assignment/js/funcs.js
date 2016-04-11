
/** Find the N closest world bank projects */
function nClosest(point, n) {
  // The SQL in english:
  // SELECT (all data) FROM (the table, world_bank_projects)
  // ORDER BY (distance of these geoms from the provided point)
  // LIMIT (to n cases)
  var sql = 'SELECT * FROM ne_10m_airports ORDER BY the_geom <-> ST_Point(' + point.lng + ',' + point.lat + ') LIMIT ' + n;

  $.ajax('https://labyer.cartodb.com/api/v2/sql/?q=' + sql).done(function(results) {
    //console.log(n +' closest:', results);
    addRecords(results);
  });
}

/** Find all points within the box constructed */
function pointsWithin(rect) {
  // Grab the southwest and northeast points in this rectangle
  var sw = rect[0];
  var ne = rect[2];

  var sql = 'SELECT * FROM ne_10m_airports WHERE the_geom @ ST_MakeEnvelope(' +
    sw.lng + ','+ sw.lat + ',' + ne.lng + ',' + ne.lat + ', 4326)';

  $.ajax('https://labyer.cartodb.com/api/v2/sql/?q=' + sql).done(function(results) {
    //console.log('pointsWithin:', results);
    addRecords(results);
  });
}


/**
 * function for adding one record
 *
 * The pattern of writing the function which solves for 1 case and then using that function
 *  in the definition of the function which solves for N cases is a common way to keep code
 *  readable, clean, and think-aboutable.
 */
function addOneRecord(rec) {
  var name = $('<p></p>')
    .text('Name: ' + rec.name);

  var code = $('<p></p>')
    .text('Airport Code: ' + rec.abbrev);

  var type = $('<p></p>')
    .text('Type: ' + rec.type);


  var recordElement = $('<li></li>')
    .addClass('list-group-item')
    .append(name)
    .append(code)
    .append(type);

  $('#project-list').append(recordElement);
}

/** Given a cartoDB resultset of records, add them to our list */
function addRecords(cartodbResults) {
  $('#project-list').empty();
  _.each(cartodbResults.rows, addOneRecord);
}
