import React, { useState} from "react";

const FormCourts = ({addCourt, itemsLength}) => {
  const [divisible, setDivisible] = useState(false);

	const formSubmit = (event) => {
		event.preventDefault();
		const form = event.target;
    const players = parseInt(form.elements["players"].value);
    const type = form.elements["type"].value;
		const price = parseInt(form.elements["price"].value);
		const divisible = form.elements["divisible"].checked;
    const qty = divisible ? parseInt(form.elements["qty"].value) : 0;
    const playersSmall = divisible ? parseInt(form.elements["playersSmall"].value) : null;
    const priceChild = divisible ? parseInt(form.elements["priceChild"].value) : null;

    const court = {
      // value: `${players}`,
			label: `${players} vs ${players}`,
			players,
			status: true,
			price,
			type,
			children: [],
			id: itemsLength + 1,
			items: []
    }
    if (divisible) {
      for (let index = 1; index <= qty; index++) {
				court.items.push(`${itemsLength + 1}_${index}`);
        court.children.push({ 
					id: `${itemsLength + 1}_${index}`,
          players, 
					label: `${playersSmall} vs ${playersSmall}`,
					status: true,
					type,
					price: priceChild,
					idParent: itemsLength + 1
				},
      )}
    }
		// const status = form.elements["status"].checked;
    addCourt({court, id: itemsLength + 1});
    setDivisible(false);
		form.reset();
	}

	return (
		<form onSubmit={formSubmit}>
			<div className="table-responsive">
				<table className="table table-striped">
					<thead>
						<tr>
							<th>#</th>
              <th>
								<select id="players">
									<option value="5">5 vs 5</option>
									<option value="6">6 vs 6</option>
									<option value="7">7 vs 7</option>
									<option value="9">9 vs 9</option>
									<option value="11">11 vs 11</option>
								</select>
							</th>
							<th>
								<select id="type">
									<option value="natural">Natural</option>
									<option value="sintetico">Sintetico</option>
								</select>
							</th>
              <th>
								$<input
									id="price"
									type="text"
									placeholder="1400"
								/>
							</th>
              <th>
								<label>Divisible</label>
								<input
									id="divisible"
                  type="checkbox"
                  onClick={() => setDivisible(!divisible)}
								/>
							</th>
              {divisible ? (
                <>
                  <th>
                    <select id="qty">
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                    </select>
                  </th>
                  <th>
                    <select id="playersSmall">
                      <option value="5">5 vs 5</option>
                      <option value="7">7 vs 7</option>
                    </select>
                  </th>
                  <th>
                    $<input
                      id="priceChild"
                      type="text"
                      placeholder="1400"
                    />
                  </th>
                </>  
              ) : null}
							{/* <th>
								<label>Estado</label>
								<input
									id="status"
									type="checkbox"
								/>
							</th> */}
							<th>
								<input type="submit" value="Agregar"  className="btn btn-success btn-rounded"/>
							</th>
						</tr>
					</thead>
				</table>
			</div>
		</form>
	);
}

export default FormCourts;