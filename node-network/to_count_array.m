function [count_array] = to_count_array(subclass_array)

subclass_all = [
    "AMIKACIN",
    "BETA-LACTAM",
    "BLEOMYCIN",
    "CHLORAMPHENICOL",
    "FOSFOMYCIN",
    "FUSIDIC ACID",
    "KANAMYCIN",
    "LINCOSAMIDE",
    "MACROLIDE",
    "METHICILLIN",
    "MUPIROCIN",
    "QUATERNARY AMMONIUM",
    "QUINOLONE",
    "SPECTINOMYCIN",
    "STREPTOMYCIN",
    "TETRACYCLINE",
    "TRIMETHOPRIM"
  ];

% count_array = zeros(1, length(subclass_all));
count_array = cellfun(@(x) sum(ismember(subclass_array,x)),subclass_all,'un',0);
count_array = cell2mat(count_array);

end

